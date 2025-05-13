import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/api/httpException';
import { prisma } from '../config/serverconfig';
import { UserRole } from '@prisma/client';

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.email) {
        throw new HttpException(401, 'Unauthenticated');
      }

      const user = await prisma.user.findUnique({
        where: { email: req.user.email },
      });

      // user role
      if (!user) {
        throw new HttpException(401, 'Unauthenticated');
      }

      const userRole = req.user.role as UserRole;
      const hasPermission = allowedRoles.includes(userRole);
      if (!hasPermission) {
        throw new HttpException(403, 'Forbidden');
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
