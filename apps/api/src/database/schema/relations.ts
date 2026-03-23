import { relations } from 'drizzle-orm';

import { sessionTable, userTable } from './identity';

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));
