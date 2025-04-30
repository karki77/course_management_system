// media request

import { NextFunction, Request, Response } from "express";
import HttpException from "../api/httpException";

/**
 * Media Request Middleware
 */
export const mediaRequest = (req: Request, _res: Response, next: NextFunction) => {
    try{
        const file= req?.file;
        const bio= req.body?.bio;

        const payload= {
            image: file?.filename,
            bio,
        }

        req.body= payload;
        next();
    }catch(error){
        next(error);
        console.log(error)
    }
}