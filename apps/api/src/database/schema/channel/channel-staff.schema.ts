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

export const channelStaffTable = pgTable(
  'channel_staff',
  {
    channelId: uuid('fk_channel_id')
      .notNull()
      .references(() => channelTable.id, { onDelete: 'cascade' }),
    userId: uuid('fk_user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    assignedAt: timestamp('assigned_at', {
      precision: 6,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.channelId, table.userId] }),
    index('channel_staff_channel_id_idx').on(table.channelId),
    index('channel_staff_user_id_idx').on(table.userId),
  ],
);

export const channelStaffRelations = relations(
  channelStaffTable,
  ({ one }) => ({
    channel: one(channelTable, {
      fields: [channelStaffTable.channelId],
      references: [channelTable.id],
    }),
    user: one(userTable, {
      fields: [channelStaffTable.userId],
      references: [userTable.id],
    }),
  }),
);

export type ChannelStaffDatabase = typeof channelStaffTable.$inferSelect;
export type ChannelStaffDatabaseInsert = typeof channelStaffTable.$inferInsert;
