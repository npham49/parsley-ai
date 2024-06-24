
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const courseTable = pgTable('course_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  summary: text('summary'),
  syllabuslink: text('syllabus_link'),
  userId: text('user_id')
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertPost = typeof courseTable.$inferInsert;
export type SelectPost = typeof courseTable.$inferSelect;