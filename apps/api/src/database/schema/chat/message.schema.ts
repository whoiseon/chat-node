import { relations } from 'drizzle-orm';
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { channelTable } from '../channel/channel.schema';
import { userTable } from '../identity/user.schema';

export const messageTypeEnum = pgEnum('message_type', [
  'message',
  'system',
  'notice',
]);

export const messageTable = pgTable(
  'message',
  {
    id: uuid().primaryKey().defaultRandom(),
    channelId: uuid('fk_channel_id')
      .notNull()
      .references(() => channelTable.id, { onDelete: 'cascade' }),
    userId: uuid('fk_user_id').references(() => userTable.id, {
      onDelete: 'set null',
    }),
    type: messageTypeEnum().notNull().default('message'),
    content: text().notNull(),
    createdAt: timestamp('created_at', {
      precision: 6,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('message_channel_id_idx').on(table.channelId),
    index('message_user_id_idx').on(table.userId),
    index('message_created_at_idx').on(table.createdAt),
    index('message_channel_created_at_idx').on(
      table.channelId,
      table.createdAt,
    ),
  ],
);

export const messageRelations = relations(messageTable, ({ one }) => ({
  channel: one(channelTable, {
    fields: [messageTable.channelId],
    references: [channelTable.id],
  }),
  user: one(userTable, {
    fields: [messageTable.userId],
    references: [userTable.id],
  }),
}));

export type MessageDatabase = typeof messageTable.$inferSelect;
export type MessageDatabaseInsert = typeof messageTable.$inferInsert;
