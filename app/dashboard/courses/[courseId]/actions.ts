"use server";

import { getCourseByIdAndUserId, updateCourseById } from "@/db/services/course";
import { userActionClient } from "@/lib/safe-action";
import { OpenAIEmbeddings } from "@langchain/openai";
import { DocumentSchema } from "@/lib/zod-schemas/document";
import { matchYoutubeUrl } from "@/utils/helperFunctions";
import {
  TranscriptResponse,
  YoutubeTranscript,
} from "@/utils/youtubeTranscript";
import { z } from "zod";
import { createDocument } from "@/db/services/document";
import { InsertContent } from "@/db/schema";
import { addContentsForDocument } from "@/db/services/content";

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

    if (!course) {
      throw new Error("Course not found");
    }
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

    if (!transcript) {
      throw new Error("Failed to fetch transcript");
    }

    const videoInformation = await fetch(
      `https://www.youtube.com/oembed?url=${parsedInput.youtubeUrl}&format=json`
    ).then((res) => res.json());

    if (!videoInformation) {
      throw new Error("Failed to fetch video information");
    }

    const createdDocument = await createDocument({
      courseId: Number(parsedInput.courseId),
      fileKey: String(parsedInput.youtubeUrl),
      userId: Number(ctx.user.id),
      title: videoInformation.title,
    });

    if (!createdDocument) {
      throw new Error("Failed to create document");
    }

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });

    const transcriptEmbeddings: InsertContent[] = await Promise.all(
      transcript.map(async (t: TranscriptResponse) => {
        const textEmbeddings = await embeddings.embedQuery(t.text);
        return {
          embedding: textEmbeddings,
          metadata: {
            offset: t.offset,
            lang: t.lang || "N/A",
            duration: t.duration || 0,
          },
          content: t.text,
          documentId: createdDocument[0].id,
          userId: Number(ctx.user.id),
        };
      })
    );

    const addedContents = await addContentsForDocument({
      documentId: createdDocument[0].id,
      contents: transcriptEmbeddings,
    });

    if (!addedContents) {
      throw new Error("Failed to add contents");
    }

    return createdDocument;
  });
