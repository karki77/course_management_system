import { UserRole } from "@prisma/client";
import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z
    .string({required_error:"Username is required"})
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  password: z
    .string({required_error:"Password is required"})
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must include at least one number" })
    .regex(/[\W_]/, { message: "Password must include at least one special character" }),
  role:z.nativeEnum(UserRole),
});

export const loginUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, { message: "Old password must be at least 8 characters long" }),
});

export type IRegisterSchema = z.infer<typeof registerUserSchema>;
export type ILoginSchema = z.infer<typeof loginUserSchema>;
export type IChangePassword = z.infer<typeof changePasswordSchema>;
