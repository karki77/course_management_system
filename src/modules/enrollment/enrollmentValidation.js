"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnrollmentSchema = void 0;
const zod_1 = require("zod");
exports.createEnrollmentSchema = zod_1.z
    .object({
    courseId: zod_1.z
        .string({ required_error: 'Course ID is required' })
        .uuid({ message: 'Course ID must be a valid UUID' }),
    userId: zod_1.z
        .string({ required_error: 'User ID is required' })
        .uuid({ message: 'User ID must be a valid UUID' }),
})
    .strict();
// add/update/delete_model_fields.
