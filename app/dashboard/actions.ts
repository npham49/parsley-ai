"use server";

import { createCourse, getCoursesByUserId } from "@/db/services/course";
import { userActionClient } from "@/lib/safe-action";
import { courseSchema } from "@/lib/zod-schemas/courses";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/dashboard");
    return course;
  });
