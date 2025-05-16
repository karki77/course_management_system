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

export const paramStudentSchema = z
  .object({
    studentId: z
      .string({ required_error: 'Student Id is required' })
      .uuid({ message: 'StudentId must be a valid UUID' }),
  })
  .strict();

export type IParamsStudentSchema = z.infer<typeof paramStudentSchema>;
export type ICreateEnrollmentSchema = z.infer<typeof createEnrollmentSchema>;
