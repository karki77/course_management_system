import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';
import type { ICreateEnrollmentSchema } from './enrollmentValidation';
import EnrollmentService from './enrollmentService';

export const enroll = async (
  req: Request<unknown, unknown, ICreateEnrollmentSchema>,
  res: Response,
  next: NextFunction
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
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getAllEnrolledUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const instructorId = req.params.courseId;
    if (!instructorId) {
      throw new HttpException(401, 'User not authenticated');
    }

    const enrollments = await EnrollmentService.getAllEnrolledUsers(
      req.params.courseId
    );
    res.send(
      new HttpResponse({
        message: 'Enrollment fetched successfully',
        data: enrollments,
      })
    );
  } catch (error) {
    next(error);
  }
};
