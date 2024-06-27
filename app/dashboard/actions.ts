"use server";

import { z } from "zod";

import { createCourse, getCoursesByClerkId } from "@/db/services/course";
import { authActionClient } from "@/lib/safe-action";

const courseSchema = z.object({
  title: z.string().min(3).max(10),
  summary: z.string().min(8).max(100).optional(),
  syllabuslink: z.string().url().optional(),
});

export const getCourses = authActionClient.action(async ({ ctx }) => {
  const courses = await getCoursesByClerkId(ctx.userId);
  return courses;
});

export const createNewCourse = authActionClient
  .schema(courseSchema)
  .action(async ({ ctx, parsedInput: { title, summary, syllabuslink } }) => {
    const course = await createCourse({
      title,
      summary,
      syllabuslink,
      userId: ctx.userId,
    });
    return course;
  });
