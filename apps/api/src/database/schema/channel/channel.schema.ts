import { relations } from 'drizzle-orm';
import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { channelReadStatusTable } from '../chat/channel-read-status.schema';
import { messageTable } from '../chat/message.schema';
import { channelMemberTable } from './channel-member.schema';

export const channelTypeEnum = pgEnum('channel_type', ['CHANNEL', 'DM']);

export const channelTable = pgTable(
  'channel',
  {
    id: uuid().primaryKey().defaultRandom(),
    type: channelTypeEnum().notNull().default('CHANNEL'),
    name: varchar({ length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    profileImageUrl: varchar('profile_image_url', { length: 255 }),
    password: varchar('password', { length: 255 }),

    createdAt: timestamp('created_at', {
      precision: 6,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      precision: 6,
      mode: 'date',
    }).$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at', {
      precision: 6,
      mode: 'date',
    }),
  },
  (table) => [
    index('channel_id_idx').on(table.id),
    index('channel_name_idx').on(table.name),
    index('channel_type_idx').on(table.type),
  ],
);

export const channelRelations = relations(channelTable, ({ many }) => ({
  members: many(channelMemberTable),
  messages: many(messageTable),
  readStatuses: many(channelReadStatusTable),
}));

export type ChannelDatabase = typeof channelTable.$inferSelect;
export type ChannelDatabaseInsert = typeof channelTable.$inferInsert;
