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
    if (!courseId) {
      throw new HttpException(400, 'Course ID is required');
    }

    const updatedCourse = await courseService.updateCourse(
      instructorId,
      courseId,
      req.body
    );

    res.send(
      new HttpResponse({
        message: 'Course updated successfully',
        data: updatedCourse,
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
    if (!courseId) {
      throw new HttpException(400, 'Course ID is required');
    }

    const data = { courseId };
    await courseService.deleteCourse(instructorId, data);

    res.send(
      new HttpResponse({
        message: 'Course deleted successfully',
      })
    );
  } catch (error) {
    next(error);
  }
};
