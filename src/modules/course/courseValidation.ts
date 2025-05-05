import { z } from 'zod';

export const createCourseSchema = z
  .object({
    title: z
      .string({ required_error: 'Course title is required' })
      .min(3, { message: 'Course title must be at least 3 characters' })
      .max(50, { message: 'Course title must be at most 50 characters' }),
    content: z
      .string({ required_error: 'Course content is required' })
      .min(10, {
        message: 'Course content must be at least 10 characters',
      })
      .max(500, {
        message: 'Course content must be at most 500 characters',
      }),
    duration: z
      .number({ required_error: 'Course duration is required' })
      .int()
      .min(1, { message: 'Course duration must be at least 1' }),
    period: z
      .string({ required_error: 'Course period is required' })
      .regex(/^(day|week|month|year)$/, {
        message: 'Period must be one of the following: day, week, month, year',
      }),
  })
  .strict();

export const updateCourseSchema = createCourseSchema.partial().strict();

export const deleteCourseSchema = z
  .object({
    courseId: z
      .string({ required_error: 'Course ID is required' })
      .uuid({ message: 'Course ID must be a valid UUID' }),
  })
  .strict();

// Type inference
export type ICreateCourseSchema = z.infer<typeof createCourseSchema>;
export type IUpdatedCourseSchema = z.infer<typeof updateCourseSchema>;
export type IDeleteCourseSchema = z.infer<typeof deleteCourseSchema>;