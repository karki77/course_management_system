import { Request, Response, NextFunction } from "express";
import {HttpResponse} from "../../utils/api/httpResponse";
import type { IRegisterSchema} from "../../utils/validators/validation";
import HttpException from "../../utils/api/httpException";

import studentService from "./service"
import { log } from "node:console";

/**
 * Register User
 */
export const registerUser = async (req: Request<unknown, unknown, IRegisterSchema>, res: Response, next: NextFunction) => {
  try {
   const data = await studentService.register(req.body);
   res.send(new HttpResponse({
      message:"User registered successfully",
      data
    }))
  } catch (error) {
    next(error);
  }
};

/**
 * Login User
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await studentService.login(req.body);
    res.send(new HttpResponse({
      message:"User login successfully",
      data
    }))
  } catch (error) {
    next(error);
  }
};

/**
 * Change User Password
 */

export const changePasssword = async (req: Request, res: Response, next: NextFunction) => {
      try{
                if(!req?.user?.id){
          throw new HttpException(401, "User not authenticated");
        }
        
        await studentService.changePassword(req.user.id, req.body);
        res.send(new HttpResponse({
          message:"Password changed successfully",
        }))
      }catch (error) {
        next(error);
      }
    };
    
export const updateProfile = async(req:Request, res:Response, next: NextFunction) => {
  try{
    console.log("hello");
    
    if(!req?.user?.id){
        throw new HttpException(401, "User not authenticated");
    };

    console.log(req.file, "check file");
    console.log("-----------------------------");
    console.log(req.files, "check files");

    await studentService.updateProfile(req.user.id, req.body);
    res.send(new HttpResponse({
      message:"Profile updated successfully",
    }))
} catch(error){
  next(error);
 }
}