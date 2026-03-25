import { relations } from 'drizzle-orm';
import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { userTable } from '../identity/user.schema';

import { channelTable } from './channel.schema';

export const channelMemberRoleEnum = pgEnum('channel_member_role', [
  'MANAGER',
  'STAFF',
  'USER',
]);

export const channelMemberTable = pgTable(
  'channel_member',
  {
    channelId: uuid('fk_channel_id')
      .notNull()
      .references(() => channelTable.id, { onDelete: 'cascade' }),
    userId: uuid('fk_user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    role: channelMemberRoleEnum().notNull().default('USER'),
    displayName: varchar('display_name', { length: 255 }).notNull(),
    joinedAt: timestamp('joined_at', {
      precision: 6,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.channelId, table.userId] }),
    uniqueIndex('channel_member_display_name_idx').on(table.channelId, table.displayName),
    index('channel_member_channel_id_idx').on(table.channelId),
    index('channel_member_user_id_idx').on(table.userId),
    index('channel_member_role_idx').on(table.channelId, table.role),
  ],
);

export const channelMemberRelations = relations(
  channelMemberTable,
  ({ one }) => ({
    channel: one(channelTable, {
      fields: [channelMemberTable.channelId],
      references: [channelTable.id],
    }),
    user: one(userTable, {
      fields: [channelMemberTable.userId],
      references: [userTable.id],
    }),
  }),
);

export type ChannelMemberDatabase = typeof channelMemberTable.$inferSelect;
export type ChannelMemberDatabaseInsert =
  typeof channelMemberTable.$inferInsert;
