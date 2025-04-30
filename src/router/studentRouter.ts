import {Router} from "express";
import { UserRole } from "@prisma/client";

import bodyValidator from "../utils/validators/bodyValidator";
import { registerUserSchema, loginUserSchema, changePasswordSchema} from "../modules/student/validation";

import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/rolemiddleware";

import { registerUser, loginUser, changePasssword} from "../modules/student/controller";

/**
 * Student Router
 */

const studentRouter = Router();

studentRouter.post('/login', bodyValidator(loginUserSchema), loginUser);

studentRouter.post('/register', bodyValidator(registerUserSchema), registerUser);

studentRouter.patch('/change-password', authMiddleware, bodyValidator(changePasswordSchema), changePasssword);

studentRouter.get('/role', authMiddleware, roleMiddleware([UserRole.STUDENT]), async (req, res) => {
   res.json({message:"Hello from student router"});
})

studentRouter.get('/instructor', authMiddleware, roleMiddleware([UserRole.INSTRUCTOR]), async (req, res) => {
   res.json({message:"Hello from instructor router"});
})

export default studentRouter;