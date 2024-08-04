"use server";

import { getCourseByIdAndUserId, updateCourseById } from "@/db/services/course";
import { userActionClient } from "@/lib/safe-action";
import { UpdateCourseSchema } from "@/lib/zod-schemas/courses";
import { revalidatePath } from "next/cache";

export const updateCourseAction = userActionClient
  .schema(UpdateCourseSchema)
  .action(async ({ ctx, parsedInput }) => {
    const course = await getCourseByIdAndUserId(parsedInput.id, ctx.user.id);

    if (!course) {
      throw new Error("Course not found");
    }

    const updatedCourse = await updateCourseById(parsedInput.id, {
      ...course,
      ...parsedInput.data,
    });

    if (!updatedCourse) {
      throw new Error("Failed to update course");
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/courses/${parsedInput.id}`);

    return updatedCourse;
  });
