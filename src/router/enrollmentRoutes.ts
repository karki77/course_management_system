import { Router } from 'express';
import {
  enroll,
  viewAllEnrolledCourses,
  getAllEnrolledStudents,
} from '../modules/enrollment/enrollmentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/rolemiddleware';
import { UserRole } from '@prisma/client';

import {
  createEnrollmentSchema,
  paramStudentSchema,
} from '../modules/enrollment/enrollmentValidation';
import { paramsCourseSchema } from '../modules/course/courseValidation';

import bodyValidator from '../utils/validators/bodyValidator';
import paramsValidator from '../utils/validators/paramValidator';
import queryValidator from '../utils/validators/queryValidator';
import { paginationSchema } from '../utils/validators/commonValidation';

const enrollmentRouter = Router();

// POST /enroll - Instructor enrolls student in course
/**
 * @swagger
 * /api/v1/user/enroll:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollment]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - studentId
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "course123"
 *               studentId:
 *                 type: string
 *                 example: "student456"
 *     responses:
 *       200:
 *         description: Enrollment successful
 */

enrollmentRouter.post(
  '/enroll',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  bodyValidator(createEnrollmentSchema),
  enroll,
);

// GET /courses/:courseId/enrollments - Instructor views enrolled users

/**
 * @swagger
 * /api/v1/user/courses/{courseId}/enrollments:
 *   get:
 *     summary: Get all enrolled users for a course with pagination
 *     tags: [Enrollment]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: ID of the course
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved enrolled users
 */
enrollmentRouter.get(
  '/courses/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramsValidator(paramsCourseSchema),
  queryValidator(paginationSchema),
  getAllEnrolledStudents,
);

// GET /viewcourses/:userId - Student views own enrolled courses
/**
 * @swagger
 * /api/v1/user/viewcourses/{userId}:
 *   get:
 *     summary: View all enrolled courses for a user
 *     tags: [Enrollment]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved enrolled courses
 */

enrollmentRouter.get(
  '/viewcourses/:studentId',
  authMiddleware,
  roleMiddleware([UserRole.STUDENT]),
  paramsValidator(paramStudentSchema),
  viewAllEnrolledCourses,
);

export default enrollmentRouter;
