"use server";

import { getCourseByIdAndUserId } from "@/db/services/course";
import { userActionClient } from "@/lib/safe-action";
import { z } from "zod";

export const getCourseAction = userActionClient
  .schema(
    z.object({
      courseId: z.string(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const course = await getCourseByIdAndUserId(
      parsedInput.courseId,
      ctx.user.id
    );
    return course;
  });
