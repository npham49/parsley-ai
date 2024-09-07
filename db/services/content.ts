import * as schema from "../schema";
import { db } from "..";
import { and, cosineDistance, desc, gt, inArray, sql, eq } from "drizzle-orm";

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

export async function findSimilarContent(
  embedding: number[],
  userId: number,
  ids?: number[],
) {
  const similarity = sql<number>`1 - (${cosineDistance(
    schema.contentTable.embedding,
    embedding,
  )})`;
  const similarContent = await db
    .select({
      content: schema.contentTable.content,
      metadata: schema.contentTable.metadata,
      documentId: schema.contentTable.documentId,
      similarity,
    })
    .from(schema.contentTable)
    .where(
      and(
        gt(similarity, 0.5),
        ids ? inArray(schema.contentTable.documentId, ids) : undefined,
        eq(schema.contentTable.userId, userId),
      ),
    )
    .orderBy((t) => desc(t.similarity));
  return similarContent;
}
