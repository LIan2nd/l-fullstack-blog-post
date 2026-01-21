import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid Email Address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;