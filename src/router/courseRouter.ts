import { Router } from 'express';
import { UserRole } from '@prisma/client';

import bodyValidator from '../utils/validators/bodyValidator';
import { getAllEnrolledUsers } from '../modules/enrollment/enrollmentController';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  createModule,
} from '../modules/course/courseController';
import {
  createCourseSchema,
  updateCourseSchema,
  paramsCourseSchema,
  createModuleSchema,
} from '../modules/course/courseValidation';

import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/rolemiddleware';
import paramValidator from '../utils/validators/paramValidator';

const courseRouter = Router();

courseRouter.post(
  '/create',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  bodyValidator(createCourseSchema),
  createCourse,
);

courseRouter.patch(
  '/update/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramValidator(paramsCourseSchema),
  bodyValidator(updateCourseSchema),
  updateCourse,
);

courseRouter.delete(
  '/delete/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramValidator(paramsCourseSchema),
  deleteCourse,
);

courseRouter.get(
  '/enroll/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramValidator(paramsCourseSchema),
  getAllEnrolledUsers,
);

courseRouter.post(
  '/create-module',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  bodyValidator(createModuleSchema),
  createModule,
);

//
export default courseRouter;
