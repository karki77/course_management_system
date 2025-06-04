import { z } from 'zod';

export const createCourseSchema = z
  .object({
    title: z
      .string({ required_error: 'Course title is required' })
      .min(3, 'Title must be at least 3 characters long')
      .max(50, 'Title must be at most 50 characters long'),

    content: z
      .string({ required_error: 'Course content is required' })
      .min(10, 'Content must be at least 10 characters long')
      .max(500, 'Content must be at most 500 characters long'),

    duration: z
      .number({ required_error: 'Course duration is required' })
      .int('Duration must be a whole number')
      .min(1, 'Duration must be at least 1'),

    period: z.enum(['day', 'week', 'month', 'year'], {
      required_error: 'Course period is required',
      invalid_type_error: 'Period must be one of: day, week, month, or year',
    }),
  })
  .strict({
    message: 'Unexpected fields found in course creation data',
  });

export const updateCourseSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters long')
      .max(50, 'Title must be at most 50 characters long')
      .optional(),

    content: z
      .string()
      .min(10, 'Content must be at least 10 characters long')
      .max(500, 'Content must be at most 500 characters long')
      .optional(),

    duration: z
      .number()
      .int('Duration must be a whole number')
      .min(1, 'Duration must be at least 1')
      .optional(),

    period: z
      .enum(['day', 'week', 'month', 'year'], {
        invalid_type_error: 'Period must be one of: day, week, month, or year',
      })
      .optional(),
  })
  .strict({
    message: 'Extra fields are not allowed in the course update data',
  });

export const paramsCourseSchema = z
  .object({
    courseId: z
      .string({ required_error: 'Course ID is required' })
      .uuid({ message: 'Course ID must be a valid UUID' }),
  })
  .strict({
    message: 'Extra fields are not allowed in the course ID parameter',
  });

export const createModuleSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(100, 'Title must be at most 100 characters long'),
    courseId: z.string().uuid('Invalid course ID format'),
  })
  .strict({
    message: 'Extra fields are not allowed in the module data',
  });

export const createLessonSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(100, 'Title must be at most 100 characters long'),
    moduleId: z.string().uuid('Invalid module ID format'),
    content: z.string().min(1, 'Content is required'),
    videoUrl: z.string().optional(),
  })
  .strict({
    message: 'Extra fields are not allowed in the lesson data',
  });
// Exporting the types for the schemase
export type ICreateCourseSchema = z.infer<typeof createCourseSchema>;
export type IUpdatedCourseSchema = z.infer<typeof updateCourseSchema>;
export type IParamsSchema = z.infer<typeof paramsCourseSchema>;
export type ICreateModuleSchema = z.infer<typeof createModuleSchema>;
export type ICreateLessonSchema = z.infer<typeof createLessonSchema>;
