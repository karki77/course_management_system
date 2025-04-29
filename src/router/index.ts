import {Router} from "express";
import studentRouter from "./studentRouter";
import emailRouter from "./emailRouter";

const router = Router();

router.use('/student', studentRouter);
router.use('/email', emailRouter)

//
export default router;