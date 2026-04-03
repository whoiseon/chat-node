import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, desc, eq, lt } from 'drizzle-orm';

import {
  AppDatabase,
  channelMemberTable,
  DB_TOKEN,
  messageTable,
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

    const rows = await this.db
      .select({
        id: messageTable.id,
        type: messageTable.type,
        content: messageTable.content,
        userId: messageTable.userId,
        displayName: channelMemberTable.displayName,
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
          displayName: string;
        } | null;
        createdAt: string;
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
              displayName: row.displayName ?? '알 수 없음',
            }
          : null,
        createdAt: row.createdAt.toISOString(),
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
