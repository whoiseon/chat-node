import { relations } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { channelStaffTable } from '../channel/channel-staff.schema';
import { channelTable } from '../channel/channel.schema';
import { dmParticipantTable } from '../channel/dm-participant.schema';

import { sessionTable } from './session.schema';

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);

export const userTable = pgTable(
  'user',
  {
    id: uuid().primaryKey().defaultRandom(),
    username: varchar({ length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 256 }).notNull(),
    displayName: varchar({ length: 255 }).notNull(),
    role: userRoleEnum().notNull().default('USER'),
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
    lastLoginAt: timestamp('last_login_at', { precision: 6, mode: 'date' }),
  },
  (table) => [uniqueIndex('user_username_idx').on(table.username)],
);

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
  managedChannels: many(channelTable),
  staffChannels: many(channelStaffTable),
  dmChannels: many(dmParticipantTable),
}));

export type UserDatabase = typeof userTable.$inferSelect;
export type UserDatabaseInsert = typeof userTable.$inferInsert;
