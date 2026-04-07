import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, count, desc, eq, gte, lt, lte, sql } from 'drizzle-orm';

import {
  AppDatabase,
  channelMemberTable,
  channelReadStatusTable,
  DB_TOKEN,
  messageTable,
  userTable,
} from '@/database';
import { GetMessagesQueryDto } from '@/features/messages/dto';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(@Inject(DB_TOKEN) private readonly db: AppDatabase) {}

  async getMessages(query: GetMessagesQueryDto) {
    const { channelId, cursor } = query;
    const limit = 30;

    const conditions = [eq(messageTable.channelId, channelId)];

    if (cursor) {
      const [cursorRow] = await this.db
        .select({ createdAt: messageTable.createdAt })
        .from(messageTable)
        .where(eq(messageTable.id, cursor))
        .limit(1);

      if (cursorRow) {
        conditions.push(lt(messageTable.createdAt, cursorRow.createdAt));
      }
    }

    // 메시지 생성 시점 이전에 가입한 멤버 수 (서브쿼리)
    const memberCountAtCreation = this.db
      .select({ count: count() })
      .from(channelMemberTable)
      .where(
        and(
          eq(channelMemberTable.channelId, messageTable.channelId),
          lte(channelMemberTable.joinedAt, messageTable.createdAt),
        ),
      );

    // 메시지를 읽은 멤버 수 (서브쿼리)
    const readCount = this.db
      .select({ count: count() })
      .from(channelReadStatusTable)
      .where(
        and(
          eq(channelReadStatusTable.channelId, messageTable.channelId),
          gte(channelReadStatusTable.lastReadAt, messageTable.createdAt),
        ),
      );

    const rows = await this.db
      .select({
        id: messageTable.id,
        type: messageTable.type,
        content: messageTable.content,
        userId: messageTable.userId,
        username: userTable.username,
        displayName: channelMemberTable.displayName,
        profileImageUrl: userTable.profileImageUrl,
        createdAt: messageTable.createdAt,
        deletedAt: messageTable.deletedAt,
        memberCount: sql<number>`(${memberCountAtCreation})`,
        readCount: sql<number>`(${readCount})`,
      })
      .from(messageTable)
      .leftJoin(
        channelMemberTable,
        and(
          eq(messageTable.channelId, channelMemberTable.channelId),
          eq(messageTable.userId, channelMemberTable.userId),
        ),
      )
      .leftJoin(userTable, eq(messageTable.userId, userTable.id))
      .where(and(...conditions))
      .orderBy(desc(messageTable.createdAt))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const messages = rows.slice(0, limit);
    const lastItem = messages[messages.length - 1];

    // 날짜별로 그룹핑 (최신순 정렬 유지)
    const grouped = new Map<
      string,
      {
        id: string;
        type: string;
        content: string;
        sender: {
          userId: string;
          username: string;
          displayName: string;
          profileImageUrl: string | null;
        } | null;
        createdAt: string;
        deletedAt: string | null;
        unreadCount: number;
      }[]
    >();

    for (const row of messages) {
      const date = row.createdAt.toISOString().split('T')[0]!;

      if (!grouped.has(date)) {
        grouped.set(date, []);
      }

      grouped.get(date)!.push({
        id: row.id,
        type: row.type,
        content: row.content,
        sender: row.userId
          ? {
              userId: row.userId,
              username: row.username ?? '알 수 없음',
              displayName: row.displayName ?? '알 수 없음',
              profileImageUrl: row.profileImageUrl ?? null,
            }
          : null,
        createdAt: row.createdAt.toISOString(),
        deletedAt: row.deletedAt?.toISOString() || null,
        unreadCount: Math.max(0, row.memberCount - row.readCount),
      });
    }

    return {
      rows: Array.from(grouped, ([date, messages]) => ({
        date,
        messages: messages.sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        ),
      })).sort((a, b) => a.date.localeCompare(b.date)),
      nextCursor: hasMore && lastItem ? lastItem.id : null,
    };
  }

}
