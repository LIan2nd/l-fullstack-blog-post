import { z } from "zod";

export const commentFormSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export type CommentFormSchema = z.infer<typeof commentFormSchema>;
