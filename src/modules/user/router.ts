// src/routes/authRouter.ts
import { Router } from 'express';
import { loginRateLimiter } from '../../middleware/loginRateLimiter';
import bodyValidator from '../../utils/validators/bodyValidator';
import queryValidator from '../../utils/validators/queryValidator';
import {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
  verifyEmailQuerySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  tokenSchema,
} from './validation';
import { authMiddleware } from '../../middleware/authMiddleware';
import userController from './controller';

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
authRouter.post(
  '/register',
  bodyValidator(registerUserSchema),
  userController.registerUser.bind(userController),
);

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
authRouter.post(
  '/login',
  loginRateLimiter,
  bodyValidator(loginUserSchema),
  userController.loginUser.bind(userController),
);

// Verify Email
/**
 * @swagger
 * /api/v1/auth/verify:
 *   get:
 *     summary: Verify email
 *     tags: [Auth]
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: "1234567890"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid token
 */
authRouter.get(
  '/verify',
  queryValidator(verifyEmailQuerySchema),
  userController.verifyEmail.bind(userController),
);

// Forgot Password
/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
authRouter.post(
  '/forgot-password',
  bodyValidator(forgotPasswordSchema),
  userController.forgotPassword.bind(userController),
);

// Reset Password
/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: "1234567890"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 20
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
authRouter.post(
  '/reset-password',
  queryValidator(tokenSchema),
  bodyValidator(resetPasswordSchema),
  userController.resetPassword.bind(userController),
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
  userController.changePassword.bind(userController),
);

export default authRouter;
