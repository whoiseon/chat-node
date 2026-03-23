import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);

export const userTable = pgTable(
  'user',
  {
    id: uuid().primaryKey().defaultRandom(),
    username: varchar({ length: 256 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 256 }).notNull(),
    displayName: varchar({ length: 256 }).notNull(),
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

export type UserDatabase = typeof userTable.$inferSelect;
export type UserDatabaseInsert = typeof userTable.$inferInsert;
