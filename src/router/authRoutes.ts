// src/routes/authRouter.ts
import { Router } from 'express';

import bodyValidator from '../utils/validators/bodyValidator';
import queryValidator from '#utils/validators/queryValidator';

import {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
  verifyEmailQuerySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../modules/user/validation';

import { authMiddleware } from '../middleware/authMiddleware';

import {
  registerUser,
  loginUser,
  changePassword,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from '../modules/user/controller';

const authRouter = Router();

// Register
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
authRouter.post('/register', bodyValidator(registerUserSchema), registerUser);

// Login
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
authRouter.post('/login', bodyValidator(loginUserSchema), loginUser);

// Verify Email

authRouter.get('/verify', queryValidator(verifyEmailQuerySchema), verifyEmail);

// Forgot Password
authRouter.post(
  '/forgot-password',
  bodyValidator(forgotPasswordSchema),
  forgotPassword,
);

// Reset Password
authRouter.post(
  '/reset-password',
  bodyValidator(resetPasswordSchema),
  resetPassword,
);

// Change Password
authRouter.patch(
  '/change-password',
  authMiddleware,
  bodyValidator(changePasswordSchema),
  changePassword,
);

// Swagger documentation for change password
/**
 * @swagger
 * /api/v1/user/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [Auth]
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
 *                 example: strongpassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: newstrongpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
export default authRouter;
