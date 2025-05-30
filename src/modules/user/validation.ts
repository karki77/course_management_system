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
      .min(5, { message: 'Email must be at least 5 characters long' })
      .max(50, { message: 'Email must be at most 50 characters long' }),

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
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
          'Password must include uppercase, lowercase, number, and special character',
      }),

    role: z.nativeEnum(UserRole),
  })
  .strict({
    message: 'Extra fields are not allowed in the registration data',
  });

export const verifyEmailQuerySchema = z
  .object({
    token: z.string({
      required_error: 'Verification token is required',
      invalid_type_error: 'Verification token must be a string',
    }),
  })
  .strict({
    message: 'Extra fields are not allowed in the verification data',
  });

export const loginUserSchema = z
  .object({
    email: z.string().toLowerCase().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
  })
  .strict({
    message: 'Extra fields are not allowed in the login data',
  });

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
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
          'New password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
  })
  .strict({
    message: 'Extra fields are not allowed in the change password data',
  });
export const updateProfileSchema = z
  .object({
    bio: z
      .string({ required_error: 'bio is required' })
      .toLowerCase()
      .min(3, { message: 'bio must be at least 3 characters' })
      .max(50, { message: 'bio must be at most 50 characters' }),
    image: z.string({ required_error: 'Image is required' }),
  })
  .strict({
    message: 'Extra fields are not allowed in the update profile data',
  });

export const forgotPasswordSchema = z
  .object({
    email: z.string().email('Invalid email format'),
  })
  .strict({
    message: 'Extra fields are not allowed in the forgot password data',
  });

export const tokenSchema = z
  .object({
    token: z.string({
      required_error: 'Token is required',
      invalid_type_error: 'Token should be string',
    }),
  })
  .strict({
    message: 'Extra fields are not allowed in the reset password data',
  });

export const resetPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password should be string',
      })
      .min(6, 'Password can not be less than 6 character')
      .max(20, 'Password can not be more than 20 character')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
          'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
  })
  .strict({
    message: 'Extra fields are not allowed in the reset password data',
  });

export const paramsUserSchema = z
  .object({
    userId: z
      .string({ required_error: 'UserId is required' })
      .uuid({ message: 'UserId must be a valid UUID' }),
  })
  .strict({
    message: 'Extra fields are not allowed in UserID parameter',
  });

// validation for all users were initialized in the userValidation.ts file
export type IParamsUserSchema = z.infer<typeof paramsUserSchema>;

export type ILoginSchema = z.infer<typeof loginUserSchema>;
export type IRegisterSchema = z.infer<typeof registerUserSchema>;

export type IUpdateProfile = z.infer<typeof updateProfileSchema>;
export type IChangePassword = z.infer<typeof changePasswordSchema>;

export type IVerifyEmailSchema = z.infer<typeof verifyEmailQuerySchema>;
export type IForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export type ITokenSchema = z.infer<typeof tokenSchema>;
export type IResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
