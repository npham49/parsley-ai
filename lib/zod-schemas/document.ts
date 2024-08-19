import { z } from "zod";

export const DocumentSchema = z.object({
  courseId: z.number(),
  type: z.enum(["youtube", "file"], {
    required_error: "You need to select a content type.",
  }),
  youtubeUrl: z.string().optional(),
  fileKey: z.string().optional(),
  pdfName: z.string().optional(),
});
