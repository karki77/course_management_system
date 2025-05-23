import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';
import type {
  ICreateEnrollmentSchema,
  IParamsStudentSchema,
} from './enrollmentValidation';
import EnrollmentService from './enrollmentService';
import type {
  IPaginationSchema,
  IParamIdSchema,
} from '#utils/validators/commonValidation';

export const enroll = async (
  req: Request<unknown, unknown, ICreateEnrollmentSchema>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const enrollment = await EnrollmentService.enroll(req.body);

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
  req: Request<IParamIdSchema, unknown, unknown, IPaginationSchema>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { enrollments, docs } = await EnrollmentService.getAllEnrolledUsers(
      req.params.id,
      req.query,
    );

    res.send(
      new HttpResponse({
        message: 'Enrollment fetched successfully',
        data: enrollments,
        docs,
      }),
    );
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
