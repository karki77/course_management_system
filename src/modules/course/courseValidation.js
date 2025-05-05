"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
exports.createCourseSchema = zod_1.z
    .object({
    title: zod_1.z
        .string({ required_error: 'Course title is required' })
        .min(3, { message: 'Course title must be at least 3 characters' })
        .max(50, { message: 'Course title must be at most 50 characters' }),
    content: zod_1.z
        .string({ required_error: 'Course content is required' })
        .min(10, {
        message: 'Course content must be at least 10 characters',
    })
        .max(500, {
        message: 'Course content must be at most 500 characters',
    }),
    duration: zod_1.z
        .number({ required_error: 'Course duration is required' })
        .int()
        .min(1, { message: 'Course duration must be at least 1' }),
    period: zod_1.z
        .string({ required_error: 'Course period is required' })
        .regex(/^(day|week|month|year)$/, {
        message: 'Period must be one of the following: day, week, month, year',
    }),
})
    .strict();
exports.updateCourseSchema = exports.createCourseSchema.partial().strict();
