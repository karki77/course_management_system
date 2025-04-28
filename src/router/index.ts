import {Router} from "express";
import studentRouter from "./studentRouter";
import emailRouter from "./emailRouter";

const router = Router();

router.use('/', studentRouter);
router.use('/', emailRouter)
export default router;