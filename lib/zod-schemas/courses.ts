import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3).max(10),
  summary: z.string().optional(),
  syllabuslink: z.union([z.literal(""), z.string().trim().url()]),
});
