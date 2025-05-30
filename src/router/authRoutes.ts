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
  tokenSchema,
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

/**
 * @swagger
 * /api/v1/auth/register:
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
 * /api/v1/auth/login:
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
/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *
 */
authRouter.post(
  '/forgot-password',
  bodyValidator(forgotPasswordSchema),
  forgotPassword,
);

// Reset Password
authRouter.post(
  '/reset-password',
  queryValidator(tokenSchema),
  bodyValidator(resetPasswordSchema),
  resetPassword,
);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   patch:
 *     summary: Change user password
 *     description: Change the password for the authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
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
 *               currentPassword:
 *                 type: string
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 20
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
authRouter.patch(
  '/change-password',
  authMiddleware,
  bodyValidator(changePasswordSchema),
  changePassword,
);

export default authRouter;
