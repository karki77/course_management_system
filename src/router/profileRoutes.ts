import { Router } from 'express';
import {
  updateProfile,
  getUserWithProfile,
  getAllRegisteredUsers,
} from '../modules/user/controller';
import { authMiddleware } from '../middleware/authMiddleware';
import upload from '../utils/multer';
import { updateProfileSchema } from '../modules/user/validation';
import { mediaRequest } from '../utils/validators/mediaRequest';
import bodyValidator from '../utils/validators/bodyValidator';
import queryValidator from '../utils/validators/queryValidator';
import { paginationSchema } from '../utils/validators/commonValidation';

const profileRouter = Router();

// PATCH /update-profile

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
profileRouter.patch(
  '/update-profile',
  authMiddleware,
  upload.single('file'),
  mediaRequest,
  bodyValidator(updateProfileSchema),
  updateProfile,
);

// GET /profile

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
profileRouter.get('/profile', authMiddleware, getUserWithProfile);

// GET /getallusers

profileRouter.get(
  '/getallusers',
  queryValidator(paginationSchema),
  getAllRegisteredUsers,
);

export default profileRouter;
