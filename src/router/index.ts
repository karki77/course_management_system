import {Router} from "express";
import studentRouter from "./studentRouter";

const router = Router();

router.use('/',  studentRouter);

export default router;