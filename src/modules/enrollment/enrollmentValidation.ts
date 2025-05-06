import { z } from 'zod';

export const createEnrollmentSchema = z
  .object({
    courseId: z
      .string({ required_error: 'Course ID is required' })
      .uuid({ message: 'Course ID must be a valid UUID' }),
    studentId: z
      .string({ required_error: 'Student ID is required' })
      .uuid({ message: 'Student ID must be a valid UUID' }),
  })
  .strict();

export type ICreateEnrollmentSchema = z.infer<typeof createEnrollmentSchema>;

// add/update/delete_model_fields.
