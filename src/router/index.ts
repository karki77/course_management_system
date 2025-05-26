import { Router } from 'express';
import courseRouter from './courseRouter';
import emailRouter from './emailRouter';
import userRouter from './userRoutes';
import authRouter from './authRoutes';
import profileRouter from './profileRoutes';
import enrollmentRouter from './enrollmentRoutes';

const router = Router();

router.use('/email', emailRouter);
router.use('/user', userRouter);
router.use('/course', courseRouter);
router.use('/user/auth', authRouter);
router.use('/user/profile', profileRouter);
router.use('/user/enrollment', enrollmentRouter);

export default router;
