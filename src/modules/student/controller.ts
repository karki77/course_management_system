import { Request, Response, NextFunction } from "express";
import {HttpResponse} from "../../utils/api/httpResponse";
import type { IRegisterSchema} from "../../utils/validators/validation";
import {changePasswordService, loginUserService, registerUserService } from "./service";
import HttpException from "../../utils/api/httpException";

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

// export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await getAllUsersService();
//     res.status(200).json({ success: true, data: users });
//   } catch (error) {
//     next(error);
//   }
// };

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await loginUserService(req.body);
    res.send(new HttpResponse({
      message:"User login successfully",
      data
    }))
  } catch (error) {
    next(error);
  }
};
    // src/controllers/passwordController.ts


export const changePasssword = async (req: Request, res: Response, next: NextFunction) => {
      try{
        
        console.log(req.user, "check logged in user")
        if(!req?.user?.id){
          throw new HttpException(401, "User not authenticated dwdawd");
        }
        console.log("hi");
        
        await changePasswordService(req.user.id, req.body);
        res.send(new HttpResponse({
          message:"Password changed successfully",
        }))
      }catch (error) {
        next(error);
      }
    };
