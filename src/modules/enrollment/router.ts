import { Router } from 'express';
import enrollmentController from './enrollmentController';
import { authMiddleware } from '../../middleware/authMiddleware';
import { roleMiddleware } from '../../middleware/rolemiddleware';
import { UserRole } from '@prisma/client';

import {
  createEnrollmentSchema,
  paramStudentSchema,
} from '../../modules/enrollment/enrollmentValidation';
import { paramsCourseSchema } from '../../modules/course/courseValidation';

import bodyValidator from '../../utils/validators/bodyValidator';
import paramsValidator from '../../utils/validators/paramValidator';
import queryValidator from '../../utils/validators/queryValidator';
import { paginationSchema } from '../../utils/validators/commonValidation';

const enrollmentRouter = Router();

// POST /enroll - Instructor enrolls student in course
/**
 * @swagger
 * /api/v1/enrollment/enroll:
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
  enrollmentController.enroll.bind(enrollmentController),
);

// GET /courses/:courseId/enrollments - Instructor views enrolled users

/**
 * @swagger
 * /api/v1/enrollment/courses/{courseId}:
 *   get:
 *     summary: Get all enrolled students for a course with pagination
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
 *         description: Successfully retrieved enrolled students
 */
enrollmentRouter.get(
  '/courses/:courseId',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramsValidator(paramsCourseSchema),
  queryValidator(paginationSchema),
  enrollmentController.getAllEnrolledStudents.bind(enrollmentController),
);

// GET /viewcourses/:studentId - Student views own enrolled courses
/**
 * @swagger
 * /api/v1/enrollment/viewcourses/{studentId}:
 *   get:
 *     summary: View all enrolled courses for a student
 *     tags: [Enrollment]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: studentId
 *         in: path
 *         required: true
 *         description: ID of the student
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
  enrollmentController.viewAllEnrolledCourses.bind(enrollmentController),
);

export default enrollmentRouter;
