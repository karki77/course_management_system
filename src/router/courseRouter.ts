import { Router } from 'express';
import { UserRole } from '@prisma/client';


import bodyValidator from '../utils/validators/bodyValidator';
import { getAllEnrolledUsers } from '../modules/enrollment/enrollmentController';
import {
  createCourse,
  updateCourse,
  deleteCourse,
} from '../modules/course/courseController';
import {
  createCourseSchema,
  updateCourseSchema,
  paramsSchema,
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
  createCourse
);

courseRouter.patch(
  '/update/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramValidator(paramsSchema),
  bodyValidator(updateCourseSchema),
  updateCourse
);

courseRouter.delete(
  '/delete/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramValidator(paramsSchema),
  deleteCourse
);

courseRouter.get(
  '/enroll/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramValidator(paramsSchema),
  getAllEnrolledUsers
);

//
export default courseRouter;
