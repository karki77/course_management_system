import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { roleMiddleware } from '../middleware/rolemiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import UserController from '../modules/user/controller';
import paramsValidator from '../utils/validators/paramValidator';
import queryValidator from '#utils/validators/queryValidator';
import { paginationSchema } from '#utils/validators/commonValidation';
import { paramsUserSchema } from '../modules/user/validation';

const userRoutes = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/v1/user/getallusers:
 *   get:
 *     tags: [User]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: All registered users retrieved successfully
 */
userRoutes.get(
  '/getallusers',
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  queryValidator(paginationSchema),
  userController.getAllRegisteredUsers.bind(userController),
);

/**
 * @swagger
 * /api/v1/user/{userId}:
 *   get:
 *     tags: [User]
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
 *         description: User retrieved successfully
 */
userRoutes.get(
  '/:userId',
  paramsValidator(paramsUserSchema),
  userController.getUserById.bind(userController),
);

export default userRoutes;
