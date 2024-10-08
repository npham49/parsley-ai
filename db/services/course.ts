import * as schema from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";

export const getCoursesByUserId = async (userId: number) => {
  const response = await db.query.courseTable.findMany({
    where: eq(schema.courseTable.userId, userId),
  });
  return response;
};

export const getCourseById = async (courseId: number) => {
  const response = await db.query.courseTable.findFirst({
    where: eq(schema.courseTable.id, courseId),
  });
  return response;
};

export const getCourseByIdAndUserId = async (
  courseId: number,
  userId: number
) => {
  const response = await db.query.courseTable.findFirst({
    where: (course, { eq }) =>
      eq(course.id, courseId) && eq(course.userId, userId),
  });
  return response;
};

export const createCourse = async (course: schema.InsertCourse) => {
  const response = await db
    .insert(schema.courseTable)
    .values(course)
    .returning();
  return response;
};

export const updateCourseById = async (
  courseId: number,
  course: schema.InsertCourse
) => {
  const response = await db
    .update(schema.courseTable)
    .set(course)
    .where(eq(schema.courseTable.id, courseId))
    .returning();
  return response;
};

export const deleteCourseById = async (courseId: number) => {
  const response = await db
    .delete(schema.courseTable)
    .where(eq(schema.courseTable.id, courseId))
    .returning();
  return response;
};
