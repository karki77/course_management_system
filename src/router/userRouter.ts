import { Router } from 'express';
import { UserRole } from '@prisma/client';

import bodyValidator from '../utils/validators/bodyValidator';
import {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
} from '../modules/user/validation';

import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/rolemiddleware';

import upload from '../utils/multer';
import { updateProfileSchema } from '../modules/user/validation';
import { mediaRequest } from '../utils/validators/mediaRequest';

import {
  registerUser,
  loginUser,
  changePasssword,
  updateProfile,
  getUserWithProfile,
} from '../modules/user/controller';

/**
 * User Router
 */

const userRouter = Router();

userRouter.post('/login', bodyValidator(loginUserSchema), loginUser);
userRouter.post('/register', bodyValidator(registerUserSchema), registerUser);
userRouter.patch(
  '/change-password',
  authMiddleware,
  bodyValidator(changePasswordSchema),
  changePasssword
);
userRouter.get(
  '/role',
  authMiddleware,
  roleMiddleware([UserRole.STUDENT]),
  async (req, res) => {
    res.json({ message: 'Hello from student router' });
  }
);
userRouter.get(
  '/instructor',
  authMiddleware,
  roleMiddleware([UserRole.INSTRUCTOR]),
  async (req, res) => {
    res.json({ message: 'Hello from instructor router' });
  }
);
userRouter.patch(
  '/update-profile',
  authMiddleware,
  upload.single('file'),
  mediaRequest,
  bodyValidator(updateProfileSchema),
  updateProfile
);
userRouter.get('/profile', authMiddleware, getUserWithProfile);

export default userRouter;
