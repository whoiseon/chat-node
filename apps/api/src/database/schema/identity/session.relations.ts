import { relations } from 'drizzle-orm';

import { sessionTable } from './session.schema';
import { userTable } from './user.schema';

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));
