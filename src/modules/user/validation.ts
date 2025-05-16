import { UserRole } from '@prisma/client';
import { z } from 'zod';

export const registerUserSchema = z
  .object({
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .toLowerCase()
      .trim()
      .email({ message: 'Invalid email address' })
      .min(5, 'Email must be at least 5 characters long')
      .max(50, 'Email must be at most 50 characters long'),
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

export const verifyEmailQuerySchema = z
  .object({
    token: z.string().min(1, 'Verification token is required'),
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

      //this regex need to be fixed

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
  .strict(); //need to fix this again okey

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
export type IVerifyEmailSchema = z.infer<typeof verifyEmailQuerySchema>;
export type ILoginSchema = z.infer<typeof loginUserSchema>;
export type IChangePassword = z.infer<typeof changePasswordSchema>;
export type IUpdateProfile = z.infer<typeof updateProfileSchema>;

// validation for all users were initialized in the userValidation.ts file
