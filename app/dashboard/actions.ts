"use server";

import { z } from "zod";

import { createCourse, getCoursesByUserId } from "@/db/services/course";
import { userActionClient } from "@/lib/safe-action";

const courseSchema = z.object({
  title: z.string().min(3).max(10),
  summary: z.string().min(8).max(100).optional(),
  syllabuslink: z.string().url().optional(),
});

export const getCourses = userActionClient.action(async ({ ctx }) => {
  const courses = await getCoursesByUserId(ctx.user.id);
  return courses;
});

export const createNewCourse = userActionClient
  .schema(courseSchema)
  .action(async ({ ctx, parsedInput }) => {
    console.log(parsedInput);
    const course = await createCourse({
      title: parsedInput.title,
      summary: parsedInput.summary,
      syllabuslink: parsedInput.syllabuslink,
      userId: ctx.user.id,
    });

    if (!course) {
      throw new Error("Failed to create course");
    }

    return course;
  });
