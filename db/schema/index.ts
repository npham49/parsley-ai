import { relations } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user_table", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  clerkId: text("clerk_id").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow(),
});

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;

export const courseTable = pgTable("course_table", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary"),
  syllabuslink: text("syllabus_link"),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow(),
});

export type InsertCourse = typeof courseTable.$inferInsert;
export type SelectCourse = typeof courseTable.$inferSelect;

export const courseRelations = relations(courseTable, ({ one, many }) => ({
  documents: many(documentTable),
  user: one(userTable, {
    fields: [courseTable.userId],
    references: [userTable.id],
  }),
}));

export const documentTable = pgTable("document_table", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courseTable.id, { onDelete: "cascade" })
    .notNull(),
  fileKey: text("file_key").notNull(),
  title: text("title").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow(),
});

export type InsertDocument = typeof documentTable.$inferInsert;
export type SelectDocument = typeof documentTable.$inferSelect;

export const documentRelations = relations(documentTable, ({ one, many }) => ({
  course: one(courseTable, {
    fields: [documentTable.courseId],
    references: [courseTable.id],
  }),
  user: one(userTable, {
    fields: [documentTable.userId],
    references: [userTable.id],
  }),
  contents: many(contentTable),
}));

export const contentTable = pgTable(
  "content_table",
  {
    id: serial("id").primaryKey(),
    documentId: integer("document_id")
      .references(() => documentTable.id, { onDelete: "cascade" })
      .notNull(),
    content: text("content").notNull(),
    metadata: json("metadata").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date())
      .defaultNow(),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

export type InsertContent = typeof contentTable.$inferInsert;
export type SelectContent = typeof contentTable.$inferSelect;

export const contentRelations = relations(contentTable, ({ one }) => ({
  document: one(documentTable, {
    fields: [contentTable.documentId],
    references: [documentTable.id],
  }),
  user: one(userTable, {
    fields: [contentTable.userId],
    references: [userTable.id],
  }),
}));
