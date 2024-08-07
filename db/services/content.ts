import * as schema from "../schema";
import { db } from "..";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";

export async function addContentsForDocument({
  documentId,
  contents,
}: {
  documentId: number;
  contents: schema.InsertContent[];
}) {
  const response = await db
    .insert(schema.contentTable)
    .values(contents)
    .returning();
  return response;
}

export async function findSimilarContent(embedding: number[]) {
  const similarity = sql<number>`1 - (${cosineDistance(
    schema.contentTable.embedding,
    embedding
  )})`;
  const similarContent = await db
    .select({
      content: schema.contentTable.content,
      metadata: schema.contentTable.metadata,
      documentId: schema.contentTable.documentId,
      similarity,
    })
    .from(schema.contentTable)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarContent;
}
