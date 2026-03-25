import { relations } from 'drizzle-orm';
import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { userTable } from '../identity/user.schema';

import { channelStaffTable } from './channel-staff.schema';
import { dmParticipantTable } from './dm-participant.schema';

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

    managerId: uuid('fk_manager_id').references(() => userTable.id, {
      onDelete: 'cascade',
    }),

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

export const channelRelations = relations(channelTable, ({ one, many }) => ({
  manager: one(userTable, {
    fields: [channelTable.managerId],
    references: [userTable.id],
  }),
  staffs: many(channelStaffTable),
  dmParticipants: many(dmParticipantTable),
}));

export type ChannelDatabase = typeof channelTable.$inferSelect;
export type ChannelDatabaseInsert = typeof channelTable.$inferInsert;
