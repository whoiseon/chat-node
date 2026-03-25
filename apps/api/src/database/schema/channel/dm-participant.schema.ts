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

export const dmParticipantTable = pgTable(
  'dm_participant',
  {
    channelId: uuid('fk_channel_id')
      .notNull()
      .references(() => channelTable.id, { onDelete: 'cascade' }),
    userId: uuid('fk_user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    joinedAt: timestamp('joined_at', {
      precision: 6,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.channelId, table.userId] }),
    index('dm_participant_channel_id_idx').on(table.channelId),
    index('dm_participant_user_id_idx').on(table.userId),
  ],
);

export const dmParticipantRelations = relations(
  dmParticipantTable,
  ({ one }) => ({
    channel: one(channelTable, {
      fields: [dmParticipantTable.channelId],
      references: [channelTable.id],
    }),
    user: one(userTable, {
      fields: [dmParticipantTable.userId],
      references: [userTable.id],
    }),
  }),
);

export type DmParticipantDatabase = typeof dmParticipantTable.$inferSelect;
export type DmParticipantDatabaseInsert =
  typeof dmParticipantTable.$inferInsert;
