import { Router } from 'express';
import { UserRole } from '@prisma/client';

import bodyValidator from '../utils/validators/bodyValidator';
import { getAllEnrolledStudents } from '../modules/enrollment/enrollmentController';
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

import queryValidator from '#utils/validators/queryValidator';
import paramValidator from '../utils/validators/paramValidator';

import {
  paginationSchema,
  paramIdSchema,
} from '#utils/validators/commonValidation';

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
  createCourse,
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
  updateCourse,
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
  '/delete/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramValidator(paramsCourseSchema),
  deleteCourse,
);

/**
 * @swagger
 * /api/v1/course/enroll/{courseId}:
 *   get:
 *     summary: Get all enrolled users for a course
 *     tags: [Enrollment]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of enrolled users
 */
courseRouter.get(
  '/enroll/:id',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramValidator(paramIdSchema),
  queryValidator(paginationSchema),
  getAllEnrolledStudents,
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
  createModule,
);

//
export default courseRouter;
