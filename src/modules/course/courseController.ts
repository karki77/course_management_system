import { Request, Response, NextFunction } from 'express';

import { HttpResponse } from '../../utils/api/httpResponse';

import type {
  ICreateCourseSchema,
} from './courseValidation';

import courseService from './courseService';
import HttpException from '../../utils/api/httpException';

export const createCourse = async (
  req: Request<unknown, unknown, ICreateCourseSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const instructorId = req.user?.id;
    if (!instructorId) {
      throw new HttpException(401, 'User not authenticated');
    }

    const course = await courseService.createCourse(instructorId, req.body);

    res.send(
      new HttpResponse({
        message: 'Course created successfully',
        data: course,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const instructorId = req.user?.id;
    if (!instructorId) {
      throw new HttpException(401, 'User not authenticated');
    }

    const courseId = req.params.courseId;
    const response = await courseService.updateCourse(
      instructorId,
      courseId,
      req.body
    );

    res.send(
      new HttpResponse({
        message: 'Course updated successfully',
        data: response,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const instructorId = req.user?.id;
    if (!instructorId) {
      throw new HttpException(401, 'User not authenticated');
    }

    const courseId = req.params.courseId;
    await courseService.deleteCourse(instructorId, courseId);

    res.send(
      new HttpResponse({
        message: 'Course deleted successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};
