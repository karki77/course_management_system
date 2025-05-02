import {Request, Response, NextFunction} from 'express';
import {HttpResponse} from '../../utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';
import type {ICreateEnrollmentSchema} from './enrollmentValidation';
import EnrollmentService from './enrollmentService';

export const enroll = async (
  req: Request<unknown, unknown, ICreateEnrollmentSchema>, res: Response, next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpException(401, 'User not authenticated');
    }

    const enrollment = await EnrollmentService.enroll(userId, req.body);

    res.send(
      new HttpResponse({
        message: 'Enrolled successfully',
        data: enrollment,
      })
    );
  } catch (error) {
    next(error);
  }
}  