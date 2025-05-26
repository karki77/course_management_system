import { Router } from 'express';
import { getUserById } from '../modules/user/controller';
import paramsValidator from '../utils/validators/paramValidator';
import { paramsUserSchema } from '../modules/user/validation';

const userRoutes = Router();

userRoutes.get('/:userId', paramsValidator(paramsUserSchema), getUserById);

export default userRoutes;
