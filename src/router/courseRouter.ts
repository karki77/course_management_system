import { Router } from 'express';
import bodyValidator from '../utils/validators/bodyValidator';
import { createCourse, updateCourse,deleteCourse} from '../modules/course/courseController';
import {
  createCourseSchema,
  updateCourseSchema,
  deleteCourseSchema
} from '../modules/course/courseValidation';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/rolemiddleware';
import { UserRole } from '@prisma/client';

const courseRouter = Router();

courseRouter.post(
  '/create',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  bodyValidator(createCourseSchema),
  createCourse
);

courseRouter.patch(
  '/update',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  bodyValidator(updateCourseSchema),
  updateCourse
);
courseRouter.delete(
  '/delete',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  bodyValidator(deleteCourseSchema),
  deleteCourse
);

export default courseRouter;
