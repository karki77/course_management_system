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

export const updateCourseSchema = z
  .object({
    title: z
      .string({ required_error: 'Course title is required' })
      .min(3, { message: 'Course title must be at least 3 characters' })
      .max(50, { message: 'Course title must be at most 50 characters' })
      .optional(),
    content: z
      .string({ required_error: 'Course content is required' })
      .min(10, {
        message: 'Course content must be at least 10 characters',
      })
      .max(500, {
        message: 'Course content must be at most 500 characters',
      })
      .optional(),
    duration: z
      .number({ required_error: 'Course duration is required' })
      .int()
      .min(1, { message: 'Course duration must be at least 1' })
      .optional(),
    period: z
      .string({ required_error: 'Course period is required' })
      .regex(/^(day|week|month|year)$/, {
        message: 'Period must be one of the following: day, week, month, year',
      })
      .optional(),
  })
  .strict();

export const paramsCourseSchema = z
  .object({
    courseId: z
      .string({ required_error: 'Course ID is required' })
      .uuid({ message: 'Course ID must be a valid UUID' }),
  })
  .strict();

export const createModuleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters long'),
  courseId: z.string().uuid('Invalid course ID format'),
});

// Type inference
export type ICreateCourseSchema = z.infer<typeof createCourseSchema>;
export type IUpdatedCourseSchema = z.infer<typeof updateCourseSchema>;
export type IParamsSchema = z.infer<typeof paramsCourseSchema>;
export type ICreateModuleSchema = z.infer<typeof createModuleSchema>;
