import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.email("Invalid Email Address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;