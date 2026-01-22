import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters")
  .regex(/[A-Z]/, "Password must include at least 1 uppercase letter")
  .regex(/[a-z]/, "Password must include at least 1 lowercase letter")
  .regex(/[0-9]/, "Password must include at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Password must include at least 1 special character");

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(40, "Name must be at most 40 characters"),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
