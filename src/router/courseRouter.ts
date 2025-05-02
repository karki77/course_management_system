import { Router } from 'express';
import bodyValidator from '../utils/validators/bodyValidator';
import { createCourse } from '../modules/course/courseController';
import { createCourseSchema } from '../modules/course/courseValidation';
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

export default courseRouter;
