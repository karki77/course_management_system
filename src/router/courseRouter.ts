import { Router } from 'express';
import { UserRole } from '@prisma/client';

import bodyValidator from '../utils/validators/bodyValidator';

import {
  createCourseSchema,
  updateCourseSchema,
  paramsCourseSchema,
  createModuleSchema,
  createLessonSchema,
  lessonProgressSchema,
} from '../modules/course/courseValidation';

import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/rolemiddleware';

import queryValidator from '#utils/validators/queryValidator';
import paramValidator from '../utils/validators/paramValidator';

import {
  paginationSchema,
  paramIdSchema,
} from '#utils/validators/commonValidation';

import courseController from '../modules/course/courseController';

const courseRouter = Router();

/**
 * @swagger
 * /api/v1/course/create:
 *   post:
 *     summary: Create a new course
 *     tags: [Course]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Programming
 *               content:
 *                 type: string
 *                 example: A beginner's guide to programming.
 *               duration:
 *                 type: integer
 *                 example: 30
 *               period:
 *                 type: string
 *                 example: 3 months
 * responses:
 *       200:
 *         description: course created successfully
 */

courseRouter.post(
  '/create',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  bodyValidator(createCourseSchema),
  courseController.createCourse.bind(courseController),
);

/**
 * @swagger
 * /api/v1/course/update/{courseId}:
 *   patch:
 *     summary: Update a course
 *     tags: [Course]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course to update
 *         schema:
 *           type: string
 *     requestBody:
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Programming
 *               content:
 *                 type: string
 *                 example: A beginner's guide to programming.
 *               duration:
 *                 type: integer
 *                 example: 30
 *               period:
 *                 type: string
 *                 example: 3 months
 * responses:
 *       200:
 *         description: course updated successfully
 */
courseRouter.patch(
  '/update/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramValidator(paramsCourseSchema),
  bodyValidator(updateCourseSchema),
  courseController.updateCourse.bind(courseController),
);

/**
 * @swagger
 * /api/v1/course/delete/{courseId}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Course]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 */
courseRouter.delete(
  '/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramValidator(paramsCourseSchema),
  courseController.deleteCourse.bind(courseController),
);

/**
 * @swagger
 * /api/v1/course/create-module:
 *   post:
 *     summary: Create a new module for a course
 *     tags: [Course]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Programming
 *               courseId:
 *                 type: string
 *                 example: example123
 *     responses:
 *       200:
 *         description: Module created successfully
 */
courseRouter.post(
  '/create-module',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  bodyValidator(createModuleSchema),
  courseController.createModule.bind(courseController),
);

// Get course
courseRouter.get(
  '/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramValidator(paramsCourseSchema),
  courseController.getCourse.bind(courseController),
);

// Create lesson
courseRouter.post(
  '/create-lesson',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  bodyValidator(createLessonSchema),
  courseController.createLesson.bind(courseController),
);

// Update lesson progress
courseRouter.post(
  '/lesson-progress',
  authMiddleware,
  bodyValidator(lessonProgressSchema),
  courseController.LessonProgress.bind(courseController),
);

//
export default courseRouter;
