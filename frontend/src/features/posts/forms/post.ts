import { z } from "zod";

export const postFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),
});

export type PostFormSchema = z.infer<typeof postFormSchema>;
