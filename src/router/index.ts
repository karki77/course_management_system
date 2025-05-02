import { Router } from 'express';
import courseRouter from './courseRouter';
import emailRouter from './emailRouter';
import userRouter from './userRouter';

const router = Router();

router.use('/email', emailRouter);
router.use('/user', userRouter);
router.use('/course', courseRouter);

export default router;
