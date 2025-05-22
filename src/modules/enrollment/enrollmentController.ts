import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';
import type {
  ICreateEnrollmentSchema,
  IParamsStudentSchema,
} from './enrollmentValidation';
import EnrollmentService from './enrollmentService';
import { IParamsSchema } from '#modules/course/courseValidation';
import { pagination as getPagination } from '../../utils/pagination/pagination';
import { ZodError } from 'zod';

/**
 * Format Zod validation errors into user-friendly messages
 */
function formatZodError(error: unknown): string {
  if (error instanceof ZodError) {
    // Extract just the messages from the errors and join them
    return error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
  }

  // If it's another kind of error, return its message or a default
  return error instanceof Error ? error.message : 'Invalid parameters';
}

export const enroll = async (
  req: Request<unknown, unknown, ICreateEnrollmentSchema>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const instructorId = req.user?.id;
    if (!instructorId) {
      throw new HttpException(401, 'User not authenticated');
    }

    const enrollment = await EnrollmentService.enroll(instructorId, req.body);

    res.send(
      new HttpResponse({
        message: 'enrollment created successfully',
        data: enrollment,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const getAllEnrolledUsers = async (
  req: Request<{ courseId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const courseId = req.params.courseId;
    const totalCount = await EnrollmentService.countEnrolledUsers(courseId);

    // Validate the query parameters for pagination
    try {
      const paginationResult = getPagination(req.query, totalCount);

      // Check if pagination validation failed
      if (!paginationResult.success) {
        // Simple error response with just the validation message
        res.status(400).json({
          success: false,
          message: paginationResult.error,
        });
        return;
      }

      const enrollments = await EnrollmentService.getAllEnrolledUsers(
        courseId,
        {
          skip: paginationResult.pagination!.skip,
          limit: paginationResult.pagination!.limit,
        },
      );
      res.send(
        new HttpResponse({
          message: 'Enrollment fetched successfully',
          data: enrollments,
          pagination: paginationResult.meta,
        }),
      );
    } catch (paginationError) {
      // Format the error message to be user-friendly
      const errorMessage = formatZodError(paginationError);

      // Simple error response with just the validation message
      console.error('Pagination validation error:', paginationError);
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const viewAllEnrolledCourses = async (
  req: Request<IParamsStudentSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      throw new HttpException(401, 'User not authenticated');
    }

    const enrollsubjects = await EnrollmentService.viewAllEnrolledCourses(
      req.params.studentId,
    );

    res.send(
      new HttpResponse({
        message: 'Courses fetched successfully',
        data: enrollsubjects,
      }),
    );
  } catch (error) {
    next(error);
  }
};
