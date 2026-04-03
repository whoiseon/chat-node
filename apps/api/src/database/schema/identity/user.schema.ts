import { relations } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { channelMemberTable } from '../channel/channel-member.schema';
import { channelReadStatusTable } from '../channel/channel-read-status.schema';
import { messageTable } from '@/database/schema/message/message.schema';

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);

export const userTable = pgTable(
  'user',
  {
    id: uuid().primaryKey().defaultRandom(),
    username: varchar({ length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 256 }).notNull(),
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
  channelMembers: many(channelMemberTable),
  messages: many(messageTable),
  readStatuses: many(channelReadStatusTable),
}));

export type UserDatabase = typeof userTable.$inferSelect;
export type UserDatabaseInsert = typeof userTable.$inferInsert;
