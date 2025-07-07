import { Router } from 'express';
import courseRouter from '../modules/course/router';
import emailRouter from './emailRouter';
import userRouter from './userRoutes';
import profileRouter from './profileRoutes';
import enrollmentRouter from '../modules/enrollment/router';
import authRouter from '../modules/user/router';

const appRouter = Router();

appRouter.use('/email', emailRouter);
appRouter.use('/auth', authRouter);
appRouter.use('/course', courseRouter);
appRouter.use('/profile', profileRouter);
appRouter.use('/enrollment', enrollmentRouter);

export default appRouter;
