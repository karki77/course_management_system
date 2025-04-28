import {Router} from "express";
import { registerUserSchema, loginUserSchema,changePasswordSchema } from "../utils/validators/validation";
import { loginUser,registerUser, changePasswordController,deleteUser} from "../modules/student/controller";
import bodyValidator from "../utils/validators/bodyValidator";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/rolemiddleware";
import { UserRole } from "@prisma/client";
import { changePassword } from "../modules/student/service";   

const studentRouter = Router();

studentRouter.post('/register', bodyValidator(registerUserSchema),registerUser);
studentRouter.post('/login', bodyValidator(loginUserSchema), loginUser);
studentRouter.patch('/change', authMiddleware, bodyValidator(changePasswordSchema), changePasswordController);

studentRouter.delete('/deactivate', deleteUser);
studentRouter.get('/student', authMiddleware, roleMiddleware([UserRole.STUDENT]), async (req, res) => {
   res.json({message:"Hello from student router"});
})

studentRouter.get('/instructor', authMiddleware, roleMiddleware([UserRole.INSTRUCTOR]), async (req, res) => {
   res.json({message:"Hello from instructor router"});
})


export default studentRouter;