import {Router} from "express";
import studentRouter from "./studentRouter";
import emailRouter from "./emailRouter";
import { getUserWithProfile, updateProfile } from "../modules/student/controller";
import { authMiddleware } from "../middleware/authMiddleware";
import upload from "../utils/multer";
import bodyValidator from "../utils/validators/bodyValidator";
import {updateProfileSchema } from "../modules/student/validation";
import { mediaRequest } from "../utils/validators/mediaRequest";

const router = Router();

router.use('/email', emailRouter)
router.use('/student', studentRouter);
router.patch('/update-profile', authMiddleware, upload.single('file'), mediaRequest, bodyValidator(updateProfileSchema), updateProfile)
router.get('/user', authMiddleware,
    getUserWithProfile)


//
export default router;