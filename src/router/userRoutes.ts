import { Router } from 'express';
import { getUserById, getAllRegisteredUsers } from '../modules/user/controller';
import paramsValidator from '../utils/validators/paramValidator';
import queryValidator from '#utils/validators/queryValidator';
import { paginationSchema } from '#utils/validators/commonValidation';
import { paramsUserSchema } from '../modules/user/validation';

const userRoutes = Router();

userRoutes.get(
  '/getallusers',
  queryValidator(paginationSchema),
  getAllRegisteredUsers,
);
userRoutes.get('/:userId', paramsValidator(paramsUserSchema), getUserById);

export default userRoutes;
