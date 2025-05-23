import { Router } from 'express';
import { UserRole } from '@prisma/client';

import bodyValidator from '../utils/validators/bodyValidator';
import {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
  verifyEmailQuerySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../modules/user/validation';

import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/rolemiddleware';

import upload from '../utils/multer';
import { updateProfileSchema } from '../modules/user/validation';
import {
  createEnrollmentSchema,
  paramStudentSchema,
} from '../modules/enrollment/enrollmentValidation';
import {
  enroll,
  viewAllEnrolledCourses,
  getAllEnrolledUsers,
} from '../modules/enrollment/enrollmentController';
import { mediaRequest } from '../utils/validators/mediaRequest';
import paramsValidator from '../utils/validators/paramValidator';

import {
  registerUser,
  loginUser,
  changePassword,
  updateProfile,
  getUserWithProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getAllRegisteredUsers,
} from '../modules/user/controller';
import queryValidator from '#utils/validators/queryValidator';
import { paramsCourseSchema } from '../modules/course/courseValidation';
import { paginationSchema } from '#utils/validators/commonValidation';
/**
 * User Router
 */

const userRouter = Router();

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "user_123"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *                         role:
 *                           type: string
 *                           example: "student"
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       example: "dGhpc2lzYXJlZnJlc2h0b2tlbg=="
 */
userRouter.post('/login', bodyValidator(loginUserSchema), loginUser);

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - name
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: User registered successfully
 */

userRouter.post('/register', bodyValidator(registerUserSchema), registerUser);

userRouter.get(
  '/getallusers',
  queryValidator(paginationSchema),
  getAllRegisteredUsers,
);

userRouter.get('/verify', queryValidator(verifyEmailQuerySchema), verifyEmail);

/**
 * @swagger
 * /api/v1/user/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
userRouter.patch(
  '/change-password',
  authMiddleware,
  bodyValidator(changePasswordSchema),
  changePassword,
);

/**
 * @swagger
 * /api/v1/user/update-profile:
 *   patch:
 *     summary: Update user profile with bio and profile picture
 *     tags: [Auth]
 *     description: Update the user's bio and optionally upload a profile picture
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 description: Short biography of the user
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file to upload
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */

userRouter.patch(
  '/update-profile',
  authMiddleware,
  upload.single('file'),
  mediaRequest,
  bodyValidator(updateProfileSchema),
  updateProfile,
);

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
userRouter.get('/profile', authMiddleware, getUserWithProfile);

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
userRouter.post(
  '/enroll',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  bodyValidator(createEnrollmentSchema),
  enroll,
);

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
userRouter.get(
  '/courses/:courseId/enrollments',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  paramsValidator(paramsCourseSchema),
  getAllEnrolledUsers,
);

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
userRouter.get(
  '/viewcourses/:userId',
  authMiddleware,
  roleMiddleware([UserRole.STUDENT]),
  paramsValidator(paramStudentSchema),
  viewAllEnrolledCourses,
);

userRouter.post(
  '/forgot-password',
  bodyValidator(forgotPasswordSchema),
  forgotPassword,
);

userRouter.post(
  '/reset-password',
  bodyValidator(resetPasswordSchema),
  resetPassword,
);

export default userRouter;
