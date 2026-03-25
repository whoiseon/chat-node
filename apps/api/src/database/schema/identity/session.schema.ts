import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { userTable } from './user.schema';

export const sessionTable = pgTable(
  'session',
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
  (table) => [
    index('session_user_id_idx').on(table.userId),
    uniqueIndex('session_session_idx').on(table.id),
  ],
);

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  // [one-to-many] userId relation
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export type SessionDatabase = typeof sessionTable.$inferSelect;
export type SessionDatabaseInsert = typeof sessionTable.$inferInsert;
