import { Request, Response, NextFunction } from "express";
import {HttpResponse} from "../../utils/api/httpResponse";
import type { IRegisterSchema} from "../../utils/validators/validation";
import { deleteUserService, getAllUsersService, loginUserService, registerUserService, updateUserService } from "./service";

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

    export const updateUser = async (req: Request, res: Response, next: NextFunction):Promise<void>  => {
        try {
          const userId = req.params.id;
          const updatedUser = await updateUserService(userId, req.body);
          res.send(new HttpResponse({
            message:"User updated successfully",
            data: updatedUser
          }));
        } catch (error) {
          next(error);
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