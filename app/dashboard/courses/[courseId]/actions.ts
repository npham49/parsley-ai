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
import {
  createDocument,
  deleteDocument,
  getDocumentByIdAndUserId,
  getDocumentsByCourseIdAndUserId,
} from "@/db/services/document";
import { InsertContent } from "@/db/schema";
import {
  addContentsForDocument,
  findSimilarContent,
} from "@/db/services/content";
import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { utapi } from "@/lib/uploadthing";
import { revalidatePath } from "next/cache";

export const getCourseDocumentsAction = userActionClient
  .schema(
    z.object({
      courseId: z.number(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    if (!parsedInput.courseId) {
      throw new Error("Invalid course id");
    }

    const documents = await getDocumentsByCourseIdAndUserId(
      parsedInput.courseId,
      ctx.user.id
    );

    if (!documents) {
      throw new Error("Documents not found");
    }
    return documents;
  });

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

export const deleteUploadedFileAction = userActionClient
  .schema(
    z.object({
      fileKey: z.string(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const file = await utapi.listFiles();
    const fileToDelete = file.files.find((f) => f.key === parsedInput.fileKey);

    if (!fileToDelete) {
      throw new Error("File not found");
    }

    if (fileToDelete.customId?.split("-")[0] !== String(ctx.user.id)) {
      throw new Error("Unauthorized");
    }

    const deleted = await utapi.deleteFiles([parsedInput.fileKey]);

    return deleted.deletedCount;
  });

export const deleteDocumentAction = userActionClient
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    if (!parsedInput.id) {
      throw new Error("No id provided");
    }

    const documentToBeDeleted = await getDocumentByIdAndUserId(
      parsedInput.id,
      ctx.user.id
    );

    if (!documentToBeDeleted?.fileKey) {
      throw new Error("File key does not exist");
    }

    if (!matchYoutubeUrl(documentToBeDeleted.fileKey)) {
      const deletedCount = await deleteUploadedFileAction({
        fileKey: documentToBeDeleted.fileKey,
      });

      if (deletedCount?.data === 0) {
        throw new Error("Files were not deleted successfully");
      }
    }

    const deletedDocument = await deleteDocument(parsedInput.id);

    revalidatePath("/dashboard/courses/" + documentToBeDeleted.courseId);
    return deletedDocument;
  });

export const addNewDocumentAction = userActionClient
  .schema(DocumentSchema)
  .action(async ({ ctx, parsedInput }) => {
    if (parsedInput.youtubeUrl !== "") {
      return loadYoutube(ctx, parsedInput);
    } else if (parsedInput.fileKey) {
      return loadDocument(ctx, parsedInput);
    }
  });

const loadYoutube = async (
  ctx: {
    user: {
      id: number;
      email: string;
      name: string | null;
      clerkId: string;
      createdAt: Date;
      updatedAt: Date;
    };
  },
  parsedInput: { youtubeUrl: string; courseId: number }
) => {
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

  revalidatePath("/dashboard/courses/" + parsedInput.courseId);

  return createdDocument;
};

const loadDocument = async (
  ctx: {
    user: {
      id: number;
      email: string;
      name: string | null;
      clerkId: string;
      createdAt: Date;
      updatedAt: Date;
    };
  },
  parsedInput: { fileKey: string; courseId: number; pdfName: string }
) => {
  if (!parsedInput.fileKey || !parsedInput.pdfName) {
    throw new Error("Missing values.");
  }
  const fileUrl = await utapi.getSignedURL(parsedInput.fileKey);

  const fileBlob = await fetch(fileUrl.url).then((res) => res.blob());

  const loader = new WebPDFLoader(fileBlob);

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splits = await textSplitter.splitDocuments(docs);

  const createdDocument = await createDocument({
    courseId: Number(parsedInput.courseId),
    fileKey: String(parsedInput.fileKey),
    userId: Number(ctx.user.id),
    title: parsedInput.pdfName,
  });

  if (!createdDocument) {
    throw new Error("Failed to create document");
  }

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const pdfEmbeddings: InsertContent[] = await Promise.all(
    splits.map(async (split) => {
      const textEmbeddings = await embeddings.embedQuery(split.pageContent);
      return {
        embedding: textEmbeddings,
        metadata: {
          pageNumber: split.metadata.loc.pageNumber,
        },
        content: split.pageContent,
        documentId: createdDocument[0].id,
        userId: Number(ctx.user.id),
      };
    })
  );
  const addedContents = await addContentsForDocument({
    documentId: createdDocument[0].id,
    contents: pdfEmbeddings,
  });

  if (!addedContents) {
    throw new Error("Failed to add contents");
  }

  revalidatePath("/dashboard/courses/" + parsedInput.courseId);

  return createdDocument;
};

export async function continueConversation(
  messages: CoreMessage[],
  documentIds?: number[]
) {
  const newMessage = messages[messages.length - 1].content;

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const textEmbeddings = await embeddings.embedQuery(newMessage as string);

  const similarContents = await findSimilarContent(textEmbeddings);

  const newMessageWithContext = `
  PLEASE ANSWER THE FOLLOWING QUESTION FROM THE USER:
  ${newMessage}
  THIS IS THE CONTEXT PROVIDED BY THE SYSTEM:
  ${similarContents.map((content) => content.content).join("\n")}
  `;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `PROVIDE YOUR ANSWERS IN MARKDOWN!
      You are a teaching assistant for a course on AI. Questions comes from your student, you must answer
      with the context provided after the line "THIS IS THE CONTEXT PROVIDED BY THE SYSTEM:", if you cannot answer
      the questions, please let the student know. You can suggest upload extra content if needed, but do specify what
      you are looking for.`,
      },
      ...messages.splice(0, messages.length - 1),
      {
        role: "user",
        content: newMessageWithContext,
      },
    ],
    onFinish: () => {
      console.log("Finished streaming", messages);
    },
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
