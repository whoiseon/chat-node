import { relations } from 'drizzle-orm';
import {
  index,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { userTable } from '../identity/user.schema';

import { channelTable } from './channel.schema';

export const channelReadStatusTable = pgTable(
  'channel_read_status',
  {
    channelId: uuid('fk_channel_id')
      .notNull()
      .references(() => channelTable.id, { onDelete: 'cascade' }),
    userId: uuid('fk_user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    lastReadAt: timestamp('last_read_at', {
      precision: 6,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.channelId, table.userId] }),
    index('channel_read_status_user_id_idx').on(table.userId),
  ],
);

export const channelReadStatusRelations = relations(
  channelReadStatusTable,
  ({ one }) => ({
    channel: one(channelTable, {
      fields: [channelReadStatusTable.channelId],
      references: [channelTable.id],
    }),
    user: one(userTable, {
      fields: [channelReadStatusTable.userId],
      references: [userTable.id],
    }),
  }),
);

export type ChannelReadStatusDatabase =
  typeof channelReadStatusTable.$inferSelect;
export type ChannelReadStatusDatabaseInsert =
  typeof channelReadStatusTable.$inferInsert;
