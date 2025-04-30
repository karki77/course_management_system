import {Router} from "express";
import studentRouter from "./studentRouter";
import emailRouter from "./emailRouter";
import upload from "../middleware/multer";
import { updateProfile } from "../modules/student/controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use('/email', emailRouter)
router.use('/student', studentRouter);
router.patch('/update-profile', authMiddleware, upload.single('file'), updateProfile)

//
export default router;