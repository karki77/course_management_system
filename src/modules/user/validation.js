"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.changePasswordSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z
    .object({
    email: zod_1.z
        .string()
        .toLowerCase()
        .email({ message: 'Invalid email address' })
        .min(5)
        .max(50),
    username: zod_1.z
        .string({ required_error: 'Username is required' })
        .toLowerCase()
        .min(3, { message: 'Username must be at least 3 characters' })
        .max(20, { message: 'Username must be at most 20 characters' })
        .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores',
    }),
    password: zod_1.z
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
    role: zod_1.z.nativeEnum(client_1.UserRole),
})
    .strict();
exports.loginUserSchema = zod_1.z
    .object({
    email: zod_1.z.string().toLowerCase().email({ message: 'Invalid email address' }),
    password: zod_1.z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' }),
})
    .strict();
exports.changePasswordSchema = zod_1.z
    .object({
    oldPassword: zod_1.z.string().min(8, {
        message: 'Old password must be at least 8 characters long',
    }),
    newPassword: zod_1.z
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
exports.updateProfileSchema = zod_1.z
    .object({
    bio: zod_1.z
        .string({ required_error: 'bio is required' })
        .toLowerCase()
        .min(3, { message: 'bio must be at least 3 characters' })
        .max(50, { message: 'bio must be at most 20 characters' }),
    image: zod_1.z.string({ required_error: 'Image is required' }),
})
    .strict();
