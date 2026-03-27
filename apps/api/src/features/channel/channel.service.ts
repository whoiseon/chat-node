import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  and,
  count,
  desc,
  eq,
  gt,
  ilike,
  inArray,
  isNull,
  lt,
  or,
  sql,
} from 'drizzle-orm';

import {
  AppDatabase,
  channelMemberTable,
  channelReadStatusTable,
  channelTable,
  DB_TOKEN,
  messageTable,
  userTable,
} from '@/database';
import {
  CreateChannelDto,
  CreateChannelPayload,
  CreateDmDto,
  CreateDmPayload,
  GetChannelsQueryDto,
  JoinChannelDto,
} from '@/features/channel/dto';

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);

  constructor(@Inject(DB_TOKEN) private readonly db: AppDatabase) {}

  async getChannel(channelId: string, userId?: string) {
    const [channel] = await this.db
      .select({
        id: channelTable.id,
        name: channelTable.name,
        description: channelTable.description,
        profileImageUrl: channelTable.profileImageUrl,
        password: channelTable.password,
        createdAt: channelTable.createdAt,
      })
      .from(channelTable)
      .where(
        and(
          eq(channelTable.id, channelId),
          eq(channelTable.type, 'CHANNEL'),
          isNull(channelTable.deletedAt),
        ),
      )
      .limit(1);

    if (!channel) {
      throw new NotFoundException({ message: '채널을 찾을 수 없습니다' });
    }

    const ids = [channel.id];

    // 가입 여부 조회
    let joinedAt: string | null = null;

    if (userId) {
      const [member] = await this.db
        .select({ joinedAt: channelMemberTable.joinedAt })
        .from(channelMemberTable)
        .where(
          and(
            eq(channelMemberTable.channelId, channelId),
            eq(channelMemberTable.userId, userId),
          ),
        )
        .limit(1);

      joinedAt = member ? member.joinedAt.toISOString() : null;
    }

    const [managers, memberCounts] = await Promise.all([
      this.getChannelManagers(ids),
      this.getMemberCounts(ids),
    ]);

    return {
      id: channel.id,
      name: channel.name,
      description: channel.description,
      profileImageUrl: channel.profileImageUrl ?? null,
      isPrivate: channel.password !== null,
      createdAt: channel.createdAt.toISOString(),
      joinedAt,
      memberCount: memberCounts.get(channel.id) ?? 0,
      manager: managers.get(channel.id) ?? null,
    };
  }

  async getChannels(query: GetChannelsQueryDto, userId?: string) {
    const { cursor, limit = 20, joined = false, search } = query;

    // 채널별 최근 메시지 시각 서브쿼리
    const lastMessageSq = this.db
      .select({
        channelId: messageTable.channelId,
        lastMessageAt: sql<Date>`max(${messageTable.createdAt})`.as(
          'last_message_at',
        ),
      })
      .from(messageTable)
      .groupBy(messageTable.channelId)
      .as('last_msg');

    // 정렬 기준: lastMessage가 있으면 그 시각, 없으면 channel.createdAt
    const sortKey = sql<Date>`coalesce(${lastMessageSq.lastMessageAt}, ${channelTable.createdAt})`;

    const conditions = [
      eq(channelTable.type, 'CHANNEL'),
      isNull(channelTable.deletedAt),
    ];

    // 채널 이름 검색
    if (search) {
      conditions.push(ilike(channelTable.name, `%${search}%`));
    }

    // 가입한 채널만 필터링
    if (joined && userId) {
      conditions.push(
        inArray(
          channelTable.id,
          this.db
            .select({ channelId: channelMemberTable.channelId })
            .from(channelMemberTable)
            .where(eq(channelMemberTable.userId, userId)),
        ),
      );
    }

    // 커서 처리
    if (cursor) {
      const [cursorRow] = await this.db
        .select({
          sortValue: sql<Date>`coalesce(${lastMessageSq.lastMessageAt}, ${channelTable.createdAt})`,
        })
        .from(channelTable)
        .leftJoin(lastMessageSq, eq(channelTable.id, lastMessageSq.channelId))
        .where(eq(channelTable.id, cursor))
        .limit(1);

      if (cursorRow) {
        conditions.push(lt(sortKey, cursorRow.sortValue));
      }
    }

    // limit + 1로 조회하여 다음 페이지 존재 여부 판단
    const rows = await this.db
      .select({
        id: channelTable.id,
        name: channelTable.name,
        description: channelTable.description,
        profileImageUrl: channelTable.profileImageUrl,
        password: channelTable.password,
        createdAt: channelTable.createdAt,
      })
      .from(channelTable)
      .leftJoin(lastMessageSq, eq(channelTable.id, lastMessageSq.channelId))
      .where(and(...conditions))
      .orderBy(desc(sortKey))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const channels = rows.slice(0, limit);
    const lastItem = channels[channels.length - 1];
    const channelIds = channels.map((ch) => ch.id);

    // 가입한 채널만 lastMessage, unreadCount 조회
    let joinedChannelIds: string[] = [];
    const joinedAtMap = new Map<string, string>();

    if (userId && channelIds.length > 0) {
      const memberRows = await this.db
        .select({
          channelId: channelMemberTable.channelId,
          joinedAt: channelMemberTable.joinedAt,
        })
        .from(channelMemberTable)
        .where(
          and(
            inArray(channelMemberTable.channelId, channelIds),
            eq(channelMemberTable.userId, userId),
          ),
        );

      joinedChannelIds = memberRows.map((r) => r.channelId);
      for (const r of memberRows) {
        joinedAtMap.set(r.channelId, r.joinedAt.toISOString());
      }
    }

    const [lastMessages, unreadCounts, managers, memberCounts] =
      await Promise.all([
        this.getLastMessages(joinedChannelIds),
        this.getUnreadCounts(joinedChannelIds, userId ?? ''),
        this.getChannelManagers(channelIds),
        this.getMemberCounts(channelIds),
      ]);

    return {
      channels: channels.map((ch) => ({
        id: ch.id,
        name: ch.name,
        description: ch.description,
        profileImageUrl: ch.profileImageUrl ?? null,
        isPrivate: ch.password !== null,
        lastMessage: lastMessages.get(ch.id) ?? null,
        unreadCount: unreadCounts.get(ch.id) ?? 0,
        createdAt: ch.createdAt.toISOString(),
        joinedAt: joinedAtMap.get(ch.id) ?? null,
        memberCount: memberCounts.get(ch.id) ?? 0,
        manager: managers.get(ch.id) ?? null,
      })),
      nextCursor: hasMore && lastItem ? lastItem.id : null,
    };
  }

  private async getMemberCounts(channelIds: string[]) {
    if (channelIds.length === 0) return new Map();

    const rows = await this.db
      .select({
        channelId: channelMemberTable.channelId,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(channelMemberTable)
      .where(inArray(channelMemberTable.channelId, channelIds))
      .groupBy(channelMemberTable.channelId);

    const map = new Map<string, number>();
    for (const row of rows) {
      map.set(row.channelId, row.count);
    }

    return map;
  }

  private async getChannelManagers(channelIds: string[]) {
    if (channelIds.length === 0) return new Map();

    const rows = await this.db
      .select({
        channelId: channelMemberTable.channelId,
        managerId: channelMemberTable.userId,
        username: userTable.username,
        displayName: channelMemberTable.displayName,
      })
      .from(channelMemberTable)
      .leftJoin(userTable, eq(channelMemberTable.userId, userTable.id))
      .where(
        and(
          inArray(channelMemberTable.channelId, channelIds),
          eq(channelMemberTable.role, 'MANAGER'),
        ),
      );

    const map = new Map<
      string,
      {
        managerId: string;
        username: string;
        displayName: string;
      }
    >();

    for (const row of rows) {
      map.set(row.channelId, {
        managerId: row.managerId,
        username: row.username ?? 'unknown',
        displayName: row.displayName,
      });
    }

    return map;
  }

  private async getLastMessages(channelIds: string[]) {
    if (channelIds.length === 0) return new Map();

    // 채널별 최근 메시지 1건 (DISTINCT ON)
    const latestIds = this.db
      .select({
        id: sql<string>`DISTINCT ON (${messageTable.channelId}) ${messageTable.id}`,
      })
      .from(messageTable)
      .where(
        and(
          inArray(messageTable.channelId, channelIds),
          eq(messageTable.type, 'message'),
        ),
      )
      .orderBy(messageTable.channelId, desc(messageTable.createdAt));

    const rows = await this.db
      .select({
        channelId: messageTable.channelId,
        content: messageTable.content,
        senderName: channelMemberTable.displayName,
        createdAt: messageTable.createdAt,
      })
      .from(messageTable)
      .leftJoin(
        channelMemberTable,
        and(
          eq(messageTable.channelId, channelMemberTable.channelId),
          eq(messageTable.userId, channelMemberTable.userId),
        ),
      )
      .where(inArray(messageTable.id, latestIds));

    const map = new Map<
      string,
      { content: string; senderName: string; createdAt: string }
    >();

    for (const row of rows) {
      map.set(row.channelId, {
        content: row.content,
        senderName: row.senderName ?? '시스템',
        createdAt: row.createdAt.toISOString(),
      });
    }

    return map;
  }

  private async getUnreadCounts(channelIds: string[], userId: string) {
    if (channelIds.length === 0) return new Map();

    const rows = await this.db
      .select({
        channelId: messageTable.channelId,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(messageTable)
      .leftJoin(
        channelReadStatusTable,
        and(
          eq(messageTable.channelId, channelReadStatusTable.channelId),
          eq(channelReadStatusTable.userId, userId),
        ),
      )
      .where(
        and(
          inArray(messageTable.channelId, channelIds),
          or(
            isNull(channelReadStatusTable.lastReadAt),
            gt(messageTable.createdAt, channelReadStatusTable.lastReadAt),
          ),
        ),
      )
      .groupBy(messageTable.channelId);

    const map = new Map<string, number>();
    for (const row of rows) {
      map.set(row.channelId, row.count);
    }

    return map;
  }

  async joinChannel(channelId: string, userId: string, body: JoinChannelDto) {
    const [channel] = await this.db
      .select({
        id: channelTable.id,
        password: channelTable.password,
      })
      .from(channelTable)
      .where(
        and(
          eq(channelTable.id, channelId),
          eq(channelTable.type, 'CHANNEL'),
          isNull(channelTable.deletedAt),
        ),
      )
      .limit(1);

    if (!channel) {
      throw new NotFoundException({ message: '채널을 찾을 수 없습니다' });
    }

    // 비밀방 비밀번호 검증
    if (channel.password) {
      if (!body.password) {
        throw new BadRequestException({
          message: '비밀번호를 입력해주세요',
        });
      }

      const valid = await bcrypt.compare(body.password, channel.password);
      if (!valid) {
        throw new UnauthorizedException({
          message: '비밀번호가 올바르지 않습니다',
        });
      }
    }

    // 이미 멤버인지 확인
    const [existing] = await this.db
      .select({ role: channelMemberTable.role })
      .from(channelMemberTable)
      .where(
        and(
          eq(channelMemberTable.channelId, channelId),
          eq(channelMemberTable.userId, userId),
        ),
      )
      .limit(1);

    if (existing) {
      return {
        channelId,
        role: existing.role,
        displayName: body.displayName ?? (await this.getUsername(userId)),
      };
    }

    // 닉네임: 입력값 또는 아이디
    const displayName = body.displayName ?? (await this.getUsername(userId));

    // 닉네임 중복 확인
    const [duplicate] = await this.db
      .select({ userId: channelMemberTable.userId })
      .from(channelMemberTable)
      .where(
        and(
          eq(channelMemberTable.channelId, channelId),
          eq(channelMemberTable.displayName, displayName),
        ),
      )
      .limit(1);

    if (duplicate) {
      throw new ConflictException({
        message: '이미 사용 중인 닉네임입니다',
      });
    }

    await this.db.insert(channelMemberTable).values({
      channelId,
      userId,
      role: 'USER',
      displayName,
    });

    return { channelId, role: 'USER' as const, displayName };
  }

  private async getUsername(userId: string): Promise<string> {
    const [user] = await this.db
      .select({ username: userTable.username })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    return user?.username ?? 'unknown';
  }

  async createChannel(
    body: CreateChannelDto,
    userId: string,
  ): Promise<CreateChannelPayload> {
    const { name, description, password, profileImageUrl } = body;

    const channelId = await this.db.transaction(async (tx) => {
      const [channel] = await tx
        .insert(channelTable)
        .values({
          name,
          description,
          password: password ? await bcrypt.hash(password, 10) : null,
          profileImageUrl: profileImageUrl ? profileImageUrl : null,
          type: 'CHANNEL',
        })
        .returning({ id: channelTable.id });

      await tx.insert(channelMemberTable).values({
        channelId: channel!.id,
        userId,
        role: 'MANAGER',
        displayName: '매니저',
      });

      return channel!.id;
    });

    return { channelId };
  }

  async createDm(body: CreateDmDto, userId: string): Promise<CreateDmPayload> {
    const { targetUserId } = body;

    if (targetUserId === userId) {
      throw new BadRequestException({
        message: '자기 자신과 DM을 생성할 수 없습니다',
      });
    }

    // 대상 유저 존재 확인
    const [targetUser] = await this.db
      .select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.id, targetUserId))
      .limit(1);

    if (!targetUser) {
      throw new NotFoundException({
        message: '대상 유저를 찾을 수 없습니다',
      });
    }

    // 기존 DM 중복 확인
    const existingDm = await this.findExistingDm(userId, targetUserId);

    if (existingDm) {
      return { channelId: existingDm };
    }

    // DM 채널 생성 + 참여자 등록 (트랜잭션)
    const channelId = await this.db.transaction(async (tx) => {
      const [channel] = await tx
        .insert(channelTable)
        .values({
          type: 'DM' as const,
          name: 'DM',
          description: '',
        })
        .returning({ id: channelTable.id });

      const [myName, targetName] = await Promise.all([
        this.getUsername(userId),
        this.getUsername(targetUserId),
      ]);

      await tx.insert(channelMemberTable).values([
        {
          channelId: channel!.id,
          userId,
          role: 'USER' as const,
          displayName: myName,
        },
        {
          channelId: channel!.id,
          userId: targetUserId,
          role: 'USER' as const,
          displayName: targetName,
        },
      ]);

      return channel!.id;
    });

    return { channelId };
  }

  private async findExistingDm(
    userIdA: string,
    userIdB: string,
  ): Promise<string | null> {
    const result = await this.db
      .select({ channelId: channelMemberTable.channelId })
      .from(channelMemberTable)
      .innerJoin(
        channelTable,
        and(
          eq(channelMemberTable.channelId, channelTable.id),
          eq(channelTable.type, 'DM'),
        ),
      )
      .where(
        or(
          eq(channelMemberTable.userId, userIdA),
          eq(channelMemberTable.userId, userIdB),
        ),
      )
      .groupBy(channelMemberTable.channelId)
      .having(eq(count(channelMemberTable.userId), 2));

    return result[0]?.channelId ?? null;
  }
}
