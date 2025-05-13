import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';
import type {
  ICreateEnrollmentSchema,
  IParamsUserSchema,
} from './enrollmentValidation';
import EnrollmentService from './enrollmentService';
import { IParamsSchema } from '#modules/course/courseValidation';

export const enroll = async (
  req: Request<unknown, unknown, ICreateEnrollmentSchema>,
  res: Response,
  next: NextFunction,
) => {
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
  req: Request<IParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const enrollments = await EnrollmentService.getAllEnrolledUsers(
      req.params.courseId,
    );
    res.send(
      new HttpResponse({
        message: 'Enrollment fetched successfully',
        data: enrollments,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const viewAllEnrolledCourses = async (
  req: Request<IParamsUserSchema>,
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
