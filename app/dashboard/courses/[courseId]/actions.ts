"use server";

import { getCourseByIdAndUserId } from "@/db/services/course";
import { userActionClient } from "@/lib/safe-action";
import { DocumentSchema } from "@/lib/zod-schemas/document";
import { matchYoutubeUrl } from "@/utils/helperFunctions";
import { YoutubeTranscript } from "@/utils/youtubeTranscript";
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

export const addNewDocumentAction = userActionClient
  .schema(DocumentSchema)
  .action(async ({ ctx, parsedInput }) => {
    if (!matchYoutubeUrl(parsedInput.youtubeUrl)) {
      throw new Error("Invalid Youtube URL");
    }

    const transcript = await YoutubeTranscript.fetchTranscript(
      parsedInput.youtubeUrl?.split("watch?v=")[1].split("&")[0]
    );

    console.log(transcript);
    return transcript;
  });
