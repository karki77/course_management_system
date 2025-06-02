import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../utils/api/httpResponse';
import HttpException from '../../utils/api/httpException';
import UserService from './service';
import { IPaginationSchema } from '../../utils/validators/commonValidation';
import type {
  ITokenSchema,
  resetPasswordSchema,
  IChangePassword,
  IForgotPasswordSchema,
  ILoginSchema,
  IRegisterSchema,
  IResetPasswordSchema,
  IUpdateProfile,
  IVerifyEmailSchema,
} from './validation';

export class UserController {
  private userService = UserService;

  /**
   * Register User
   */
  public async registerUser(
    req: Request<unknown, unknown, IRegisterSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await this.userService.register(req.body);
      const filteredUsers = {
        id: user.id,
        email: user.email,
      };
      res.send(
        new HttpResponse({
          message: 'User registered successfully',
          data: filteredUsers,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all Registered Users
   */
  public async getAllRegisteredUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { users, docs } = await this.userService.getAllRegisteredUsers(
        req.query as IPaginationSchema,
      );
      const filteredUsers = users.map(
        (user: { id: string; email: string }) => ({
          id: user.id,
          email: user.email,
        }),
      );
      res.send(
        new HttpResponse({
          message: 'Registered users fetched successfully',
          data: filteredUsers,
          docs,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get User by Id
   */
  public async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const user = await this.userService.getUserById(userId);
      res.send(
        new HttpResponse({
          message: 'User with valid Id fetched successfully',
          data: user,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify Email
   */
  public async verifyEmail(
    req: Request<unknown, unknown, unknown, IVerifyEmailSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Extract token from query
      const { token } = req.query as IVerifyEmailSchema;
      await this.userService.verifyEmail({ token });

      res.send(
        new HttpResponse({
          message: 'Email verified successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login User
   */
  public async loginUser(
    req: Request<unknown, unknown, ILoginSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { user, accessToken, refreshToken } = await this.userService.login(
        req.body,
      );
      const filteredUsers = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      res.send(
        new HttpResponse({
          message: 'User login successfully',
          data: {
            users: filteredUsers,
            accessToken,
            refreshToken,
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change User Password
   */
  public async changePassword(
    req: Request<unknown, unknown, IChangePassword>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req?.user?.id) {
        throw new HttpException(401, 'User not authenticated');
      }

      await this.userService.changePassword(req.user.id, req.body);
      res.send(
        new HttpResponse({
          message: 'Password changed successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  public async updateProfile(
    req: Request<unknown, unknown, IUpdateProfile>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req?.user?.id) {
        throw new HttpException(401, 'User not authenticated');
      }

      const image = req.file?.filename!;
      const bio = req.body.bio;

      const updatedprofile = await this.userService.updateProfile(req.user.id, {
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
  }

  /**
   * Get User Profile
   */
  public async getUserWithProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req?.user?.id) {
        throw new HttpException(404, 'User not found');
      }
      const user = await this.userService.getUserWithProfile(req.user.id);
      const filteredUsers = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      res.send(
        new HttpResponse({
          message: 'user with profile fetched successfully',
          data: filteredUsers,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request a password reset
   */
  public async forgotPassword(
    req: Request<unknown, unknown, IForgotPasswordSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.userService.requestPasswordReset(req.body);
      res.send(
        new HttpResponse({
          message: 'Password reset link sent successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password with token
   */
  public async resetPassword(
    req: Request<unknown, unknown, IResetPasswordSchema, ITokenSchema>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // function ko parameter 3 ya 3+ objects pass
      await this.userService.resetPassword(req.query.token, req.body.password);
      res.send(
        new HttpResponse({
          message: 'Password reset successfully',
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
