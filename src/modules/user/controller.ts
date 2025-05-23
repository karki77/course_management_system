import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import type {
  IChangePassword,
  IForgotPasswordSchema,
  ILoginSchema,
  IRegisterSchema,
  IResetPasswordSchema,
  IUpdateProfile,
  IVerifyEmailSchema,
} from './validation';
import HttpException from '../../utils/api/httpException';
import UserService from './service';

/**
 * Register User
 */
export const registerUser = async (
  req: Request<unknown, unknown, IRegisterSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await UserService.register(req.body);
    res.send(
      new HttpResponse({
        message: 'User registered successfully',
        data,
      }),
    );
  } catch (error) {
    next(error);
  }
};
/**
 * Get all Registered Users
 */

export const getAllRegisteredUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { users, docs } = await UserService.getAllRegisteredUsers(req.query);
    res.send(
      new HttpResponse({
        message: 'Registered users fetched successfully',
        data: users,
        docs,
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Email
 */
export const verifyEmail = async (
  req: Request<unknown, unknown, unknown, IVerifyEmailSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract token from query
    const { token } = req.query as IVerifyEmailSchema;
    await UserService.verifyEmail({ token });

    res.send(
      new HttpResponse({
        message: 'Email verified successfully',
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login User
 */
export const loginUser = async (
  req: Request<unknown, unknown, ILoginSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await UserService.login(req.body);
    res.send(
      new HttpResponse({
        message: 'User login successfully',
        data,
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Change User Password
 */

export const changePassword = async (
  req: Request<unknown, unknown, IChangePassword>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req?.user?.id) {
      throw new HttpException(401, 'User not authenticated');
    }

    await UserService.changePassword(req.user.id, req.body);
    res.send(
      new HttpResponse({
        message: 'Password changed successfully',
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request<unknown, unknown, IUpdateProfile>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req?.user?.id) {
      throw new HttpException(401, 'User not authenticated');
    }

    const image = req.file?.filename!;
    const bio = req.body.bio;

    const updatedprofile = await UserService.updateProfile(req.user.id, {
      bio,
      image,
    });

    res.send(
      new HttpResponse({
        message: 'Profile updated successfully',
        data: updatedprofile,
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Profile
 */

export const getUserWithProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req?.user?.id) {
      throw new HttpException(404, 'User not found');
    }
    const user = await UserService.getUserWithProfile(req.user.id);
    res.send(
      new HttpResponse({
        message: 'user with profile fetched successfully',
        data: user,
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Request a password reset
 */

export const forgotPassword = async (
  req: Request<unknown, unknown, IForgotPasswordSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await UserService.requestPasswordReset(req.body);
    res.send(
      new HttpResponse({
        message: 'Password reset link sent successfully',
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with token
 */

export const resetPassword = async (
  req: Request<unknown, unknown, IResetPasswordSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await UserService.resetPassword(req.body);
    res.send(
      new HttpResponse({
        message: 'Password reset successfully',
      }),
    );
  } catch (error) {
    next(error);
  }
};
