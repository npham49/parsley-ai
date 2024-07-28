import * as schema from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";

export const getUserByClerkId = async (clerkId: string) => {
  const response = await db.query.userTable.findFirst({
    where: eq(schema.userTable.clerkId, clerkId),
  });
  return response;
};

export const createUser = async (user: {
  email: string;
  name: string;
  clerkId: string;
}) => {
  const response = await db
    .insert(schema.userTable)
    .values({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return response;
};

export const updateUserById = async (
  userId: number,
  user: {
    email?: string;
    name?: string;
  }
) => {
  const response = await db
    .update(schema.userTable)
    .set({
      ...user,
      updatedAt: new Date(),
    })
    .where(eq(schema.userTable.id, userId))
    .returning();
  return response;
};

export const updateUserByClerkId = async (
  clerkId: string,
  user: {
    email?: string;
    name?: string;
  }
) => {
  const response = await db
    .update(schema.userTable)
    .set({
      ...user,
      updatedAt: new Date(),
    })
    .where(eq(schema.userTable.clerkId, clerkId))
    .returning();
  return response;
};

export const deleteUserByClerkId = async (clerkId: string) => {
  const response = await db
    .delete(schema.userTable)
    .where(eq(schema.userTable.clerkId, clerkId))
    .returning();
  return response;
};

export const deleteUserById = async (userId: number) => {
  const response = await db
    .delete(schema.userTable)
    .where(eq(schema.userTable.id, userId))
    .returning();
  return response;
};
