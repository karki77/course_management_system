import { UserRole } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

import { prisma } from '../config/setup/dbSetup';
import HttpException from '../utils/api/httpException';

/**
 * Role Middleware
 */
export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.email) {
        throw new HttpException(401, 'Unauthenticated');
      }

      const user = await prisma.user.findUnique({
        where: { email: req.user.email },
      });

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
