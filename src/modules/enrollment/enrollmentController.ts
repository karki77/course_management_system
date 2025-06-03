import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';

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
    const { data } = await EnrollmentService.enroll(req.body);

    res.send(
      new HttpResponse({
        message: 'enrollment created successfully',
        data,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const getAllEnrolledStudents = async (
  req: Request<IParamIdSchema, unknown, unknown, IPaginationSchema>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { data, docs } = await EnrollmentService.getAllEnrolledStudents(
      req.params.id,
      req.query,
    );

    res.send(
      new HttpResponse({
        message: 'Enrollment fetched successfully',
        data,
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
    const { data, docs } = await EnrollmentService.viewAllEnrolledCourses(
      req.params.studentId,
      req.query,
    );

    res.send(
      new HttpResponse({
        message: 'Courses fetched successfully',
        data,
        docs,
      }),
    );
  } catch (error) {
    next(error);
  }
};
