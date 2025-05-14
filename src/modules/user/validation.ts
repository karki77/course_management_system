import { UserRole } from '@prisma/client';
import { z } from 'zod';

export const registerUserSchema = z
  .object({
    email: z
      .string()
      .toLowerCase()
      .email({ message: 'Invalid email address' })
      .min(5)
      .max(50),
    username: z
      .string({ required_error: 'Username is required' })
      .toLowerCase()
      .min(3, { message: 'Username must be at least 3 characters' })
      .max(20, { message: 'Username must be at most 20 characters' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores',
      }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, {
        message: 'Password must include at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must include at least one lowercase letter',
      })
      .regex(/[0-9]/, {
        message: 'Password must include at least one number',
      })
      .regex(/[\W_]/, {
        message: 'Password must include at least one special character',
      }),
    role: z.nativeEnum(UserRole),
  })
  .strict();

export const verifyEmailSchema = z
  .object({
    email: z
      .string()
      .toLowerCase()
      .email({ message: 'Invalid email address' })
      .min(5)
      .max(50),
    code: z
      .string({ required_error: 'Verification code is required' })
      .min(6, { message: 'Verification code must be at least 6 characters' })
      .max(6, { message: 'Verification code must be at most 6 characters' }),
  })
  .strict();

export const loginUserSchema = z
  .object({
    email: z.string().toLowerCase().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, {
      message: 'Old password must be at least 8 characters long',
    }),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, {
        message: 'New password must be at least 8 characters long',
      })
      .regex(/[A-Z]/, {
        message: 'New password must include at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'New password must include at least one lowercase letter',
      })
      .regex(/[0-9]/, {
        message: 'New password must include at least one number',
      })
      .regex(/[\W_]/, {
        message: 'New password must include at least one special character',
      }),
  })
  .strict();

export const updateProfileSchema = z
  .object({
    bio: z
      .string({ required_error: 'bio is required' })
      .toLowerCase()
      .min(3, { message: 'bio must be at least 3 characters' })
      .max(50, { message: 'bio must be at most 20 characters' }),
    image: z.string({ required_error: 'Image is required' }),
  })
  .strict();

export type IRegisterSchema = z.infer<typeof registerUserSchema>;
export type IVerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
export type ILoginSchema = z.infer<typeof loginUserSchema>;
export type IChangePassword = z.infer<typeof changePasswordSchema>;
export type IUpdateProfile = z.infer<typeof updateProfileSchema>;

// validation for all users were initialized in the userValidation.ts file
