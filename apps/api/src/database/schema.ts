import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const userTable = pgTable(
  'user',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar({ length: 256 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 256 }).notNull(),
    displayName: varchar({ length: 256 }).notNull(),
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
  (table) => [index('idx_username').on(table.username)],
);

export const authTokenTable = pgTable(
  'auth_token',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('fk_user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    blocked: boolean('blocked').notNull().default(false),
    createdAt: timestamp('created_at', {
      precision: 6,
      mode: 'date',
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('idx_auth_token_user_id').on(table.userId)],
);

export const adminUserTable = pgTable(
  'admin_user',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('fk_user_id')
      .notNull()
      .unique()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', {
      precision: 6,
      mode: 'date',
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      precision: 6,
      mode: 'date',
      withTimezone: true,
    }).$onUpdate(() => new Date()),
  },
  (table) => [index('idx_user_id').on(table.userId)],
);

// =========================
// Relations
// =========================

export const userRelations = relations(userTable, ({ many, one }) => ({
  authTokens: many(authTokenTable),
  adminUser: one(adminUserTable),
}));

export const authTokenRelations = relations(authTokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [authTokenTable.userId],
    references: [userTable.id],
  }),
}));

export const adminUserRelations = relations(adminUserTable, ({ one }) => ({
  user: one(userTable, {
    fields: [adminUserTable.userId],
    references: [userTable.id],
  }),
}));
