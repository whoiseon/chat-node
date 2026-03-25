import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { and, count, eq, or } from 'drizzle-orm';

import {
  AppDatabase,
  channelTable,
  DB_TOKEN,
  dmParticipantTable,
  userTable,
} from '@/database';
import {
  CreateChannelDto,
  CreateChannelPayload,
  CreateDmDto,
  CreateDmPayload,
} from '@/features/channel/dto';

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);

  constructor(@Inject(DB_TOKEN) private readonly db: AppDatabase) {}

  async createChannel(
    body: CreateChannelDto,
    userId: string,
  ): Promise<CreateChannelPayload> {
    const { name, description, password, profileImageUrl } = body;

    const [channel] = await this.db
      .insert(channelTable)
      .values({
        name,
        description,
        managerId: userId,
        password: password ? password : null,
        profileImageUrl: profileImageUrl ? profileImageUrl : null,
        type: 'CHANNEL',
      })
      .returning({
        channelId: channelTable.id,
      });

    return { channelId: channel!.channelId };
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

      await tx.insert(dmParticipantTable).values([
        { channelId: channel!.id, userId },
        { channelId: channel!.id, userId: targetUserId },
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
      .select({ channelId: dmParticipantTable.channelId })
      .from(dmParticipantTable)
      .innerJoin(
        channelTable,
        and(
          eq(dmParticipantTable.channelId, channelTable.id),
          eq(channelTable.type, 'DM'),
        ),
      )
      .where(
        or(
          eq(dmParticipantTable.userId, userIdA),
          eq(dmParticipantTable.userId, userIdB),
        ),
      )
      .groupBy(dmParticipantTable.channelId)
      .having(eq(count(dmParticipantTable.userId), 2));

    return result[0]?.channelId ?? null;
  }
}
