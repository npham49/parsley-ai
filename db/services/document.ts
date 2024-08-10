import * as schema from "../schema";
import { db } from "..";
import { and, eq } from "drizzle-orm";

export async function getDocumentsByUserId(userId: number) {
  const response = await db.query.documentTable.findMany({
    where: eq(schema.documentTable.userId, userId),
  });
  return response;
}

export async function getDocumentByIdAndUserId(
  documentId: number,
  userId: number
) {
  const response = await db.query.documentTable.findFirst({
    where: and(
      eq(schema.documentTable.id, documentId),
      eq(schema.documentTable.userId, userId)
    ),
  });
  return response;
}

export async function getDocumentsByCourseIdAndUserId(
  courseId: number,
  userId: number
) {
  const response = await db.query.documentTable.findMany({
    where: and(
      eq(schema.documentTable.courseId, courseId),
      eq(schema.documentTable.userId, userId)
    ),
  });
  return response;
}

export async function createDocument(document: schema.InsertDocument) {
  const response = await db
    .insert(schema.documentTable)
    .values(document)
    .returning({ id: schema.documentTable.id });
  return response;
}
