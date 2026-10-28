import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const briefings = sqliteTable('briefings', {
  date: text('date').primaryKey(),
  payload: text('payload').notNull(),
  updatedAt: text('updated_at').notNull(),
});
