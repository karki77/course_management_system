import { Request, Response, NextFunction } from 'express';

import { HttpResponse } from '../../utils/api/httpResponse';

import type {
  ICreateCourseSchema,
  ICreateModuleSchema,
  IUpdatedCourseSchema,
  ICreateLessonSchema,
} from './courseValidation';

import courseService from './courseService';
import HttpException from '../../utils/api/httpException';

export class CourseController {
  private courseService = courseService;
  /**
   * Get Course
   */
  public async getCourse(
    req: Request<{ courseId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const courseId = req.params.courseId;
      const instructorId = req.user?.id;
      if (!instructorId) {
        throw new HttpException(401, 'User not authenticated');
      }
      const course = await this.courseService._getCourse(
        courseId,
        instructorId,
      );

      res.send(
        new HttpResponse({
          message: 'Course retrieved successfully',
          data: course,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create Course
   */
  public async createCourse(
    req: Request<unknown, unknown, ICreateCourseSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const instructorId = req.user?.id;
      if (!instructorId) {
        throw new HttpException(401, 'User not authenticated');
      }

      const course = await this.courseService.createCourse(
        instructorId,
        req.body,
      );

      res.send(
        new HttpResponse({
          message: 'Course created successfully',
          data: course,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Course
   */
  public async updateCourse(
    req: Request<{ courseId: string }, unknown, IUpdatedCourseSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const instructorId = req.user?.id;
      if (!instructorId) {
        throw new HttpException(401, 'User not authenticated');
      }

      const courseId = req.params.courseId;
      const response = await this.courseService.updateCourse(
        instructorId,
        courseId,
        req.body,
      );

      res.send(
        new HttpResponse({
          message: 'Course updated successfully',
          data: response,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Course
   */
  public async deleteCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const instructorId = req.user?.id;
      if (!instructorId) {
        throw new HttpException(401, 'User not authenticated');
      }

      const courseId = req.params.courseId;
      await this.courseService.deleteCourse(instructorId, courseId);

      res.send(
        new HttpResponse({
          message: 'Course deleted successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create Module
   */
  public async createModule(
    req: Request<unknown, unknown, ICreateModuleSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const module = await this.courseService.createModule(req.body);

      res.send(
        new HttpResponse({
          message: 'Module created successfully',
          data: module,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create Lesson
   */
  public async createLesson(
    req: Request<unknown, unknown, ICreateLessonSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const lesson = await this.courseService.createLesson(req.body);

      res.send(
        new HttpResponse({
          message: 'Lesson created successfully',
          data: lesson,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new CourseController();
