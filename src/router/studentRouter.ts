import {Router} from "express";
import { registerUserSchema, loginUserSchema, updateUserSchema } from "../utils/validators/validation";
import { loginUser,registerUser, updateUser,deleteUser} from "../modules/student/controller";
import bodyValidator from "../utils/validators/bodyValidator";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/rolemiddleware";
import { UserRole } from "@prisma/client";

const studentRouter = Router();

studentRouter.post('/register', bodyValidator(registerUserSchema),registerUser);
studentRouter.post('/login', bodyValidator(loginUserSchema), loginUser);
studentRouter.patch('/update', authMiddleware, bodyValidator(updateUserSchema), updateUser);

studentRouter.delete('/deactivate', deleteUser);
studentRouter.get('/student', authMiddleware, roleMiddleware([UserRole.STUDENT]), async (req, res) => {
   res.json({message:"Hello from student router"});
})

studentRouter.get('/instructor', authMiddleware, roleMiddleware([UserRole.INSTRUCTOR]), async (req, res) => {
   res.json({message:"Hello from instructor router"});
})


export default studentRouter;