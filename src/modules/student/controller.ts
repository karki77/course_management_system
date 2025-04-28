import { Request, Response, NextFunction } from "express";
import {HttpResponse} from "../../utils/api/httpResponse";
import type { IRegisterSchema} from "../../utils/validators/validation";
import { PasswordChange } from "../../interfaces/passwordInterface";
import { deleteUserService, getAllUsersService, loginUserService, registerUserService,changePassword } from "./service";

/**
 * Register User
 */
export const registerUser = async (req: Request<unknown, unknown, IRegisterSchema>, res: Response, next: NextFunction) => {
  try {
   const data = await registerUserService(req.body);
   res.send(new HttpResponse({
      message:"User registered successfully",
      data
    }))
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await loginUserService(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data
    });
  } catch (error) {
    next(error);
  }
};

    // src/controllers/passwordController.ts


    export const changePasswordController = (req: Request, res: Response): void => {
      const { oldPassword, newPassword, confirmPassword }: PasswordChange = req.body;
    
      // Validate that all required fields are provided
      if (!oldPassword || !newPassword || !confirmPassword) {
        res.status(400).json({ error: "All fields (oldPassword, newPassword, confirmPassword) are required." });
        return;
      }
    
      // Call the service function to change the password
      const result = changePassword({ oldPassword, newPassword, confirmPassword });
    
      // Return the result to the client
      if (result === "Password changed successfully!") {
        res.status(200).json({ message: result });
      } else {
        res.status(400).json({ error: result });
      }
    };

      export const deleteUser = async (req: Request, res: Response, next: NextFunction):Promise<void>  => {
        try {
          const userId = req.params.id;
          const data = await deleteUserService(userId);
          res.send(new HttpResponse({
            message:"User deleted successfully", 
            data:{userId: data.userId}
          }));
        } catch (error) {
          next(error);
        }
      };