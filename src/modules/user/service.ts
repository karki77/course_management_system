import HttpException from '../../utils/api/httpException';
import { prisma } from '../../config/setup/dbSetup';
import { sendEmail } from '../../utils/email/service';
import { generateToken } from '../../middleware/authMiddleware';
import { randomBytes } from 'crypto';

import { hashPassword, verifyPassword } from '../../utils/password/hash';
import type {
  IRegisterSchema,
  ILoginSchema,
  IChangePassword,
  IUpdateProfile,
  IVerifyEmailSchema,
  IForgotPasswordSchema,
  IResetPasswordSchema,
} from './validation';
import { pagination, getPageDocs } from '#utils/pagination/pagination';
import { IPaginationSchema } from '../../utils/validators/commonValidation';

/**
 * User Service
 */
class UserService {
  getInstance: any;
  async register(data: IRegisterSchema) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new HttpException(400, 'Email or username already exist');
    }
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        verificationToken: verificationToken,
        verificationTokenExpires: verificationTokenExpires,
        profile: {
          create: {
            bio: 'hello there',
            image: ' ',
          },
        },
      },
    });

    // Update verification link to use token
    const verificationLink = `http://localhost:9000/api/v1/user/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Email Verification',
      text: `Hello ${user.username}, please verify your email by clicking on the following link: ${verificationLink}`,
      html: `<h1>Email Verification</h1><p>Hello ${user.username}, please verify your email by clicking on the following link: <a href="${verificationLink}">Verify Email</a></p>`,
    });

    return user;
  }

  async verifyEmail(query: IVerifyEmailSchema) {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: query.token,
        verificationTokenExpires: {
          gte: new Date(), // Token is still valid (not expired)
        },
      },
    });

    if (!user) {
      throw new HttpException(400, 'Invalid or expired verification token.');
    }

    if (user.isEmailVerified) {
      throw new HttpException(400, 'Email already verified');
    }
    // Update user to set email as verified
    // and clear the verification token
    // and token expiration date
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });
  }

  async getAllRegisteredUsers(query: IPaginationSchema) {
    const { skip, limit, page } = pagination({
      limit: query.limit,
      page: query.page,
    });

    const [users, count] = await Promise.all([
      await prisma.user.findMany({
        take: limit,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count(),
    ]);

    const docs = getPageDocs({
      page,
      limit,
      count,
    });

    return {
      users,
      docs,
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isEmailVerified: true,
        profile: {
          select: {
            bio: true,
            image: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    return user;
  }

  async login(data: ILoginSchema) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new HttpException(401, 'Invalid credentials');
    }

    const isPasswordValid = await verifyPassword(user.password, data.password);
    if (!isPasswordValid) {
      throw new HttpException(401, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async changePassword(userId: string, data: IChangePassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // !USER THROW -> HTTPEXCEPTION
    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    // user.password, data.oldPassword -> check compare.
    const isOldPassordValid = await verifyPassword(
      user.password,
      data.oldPassword,
    );

    if (!isOldPassordValid) {
      throw new HttpException(400, 'Old password is incorrect');
    }

    // Check if oldPassword and newPassword are same
    if (data.oldPassword === data.newPassword) {
      throw new HttpException(
        400,
        'New password cannot be the same as the old password',
      );
    }

    // user password -> update with hash.
    const hashedPassword = await hashPassword(data.newPassword);

    // update password in db
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }

  async updateProfile(userId: string, data: IUpdateProfile) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    // !USER THROW -> HTTPEXCEPTION
    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    if (!user.profile) {
      throw new HttpException(404, 'Profile not found');
    }

    return await prisma.profile.update({
      where: {
        id: user.profile.id,
      },

      data: {
        ...(data.image && { image: data.image }), // best
        ...(data.bio && { bio: data.bio }),
      },
    });
  }

  async getUserWithProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        courses: true,
      },
    });

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    return user;
  }
  // forgot password
  async requestPasswordReset(data: IForgotPasswordSchema) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    //save token to db
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpires: resetTokenExpires,
      },
    });

    // create reset link
    const resetLink = `http://localhost:9000/api/v1/user/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      text: `Hello ${user.username}, please reset your password by clicking on the following link: ${resetLink}. This link will expire in 1 hour.`,
      html: `<h1>Password Reset</h1>
      <p>Hello ${user.username},</p>
      <p>Please reset your password by clicking on the following link: <a href="${resetLink}">Reset Password</a>. This link will expire in 1 hour.</p>`,
    });
  }

  /**
   * Reset Password
   */
  async resetPassword(token: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new HttpException(400, 'Invalid or expired reset token.');
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Confirmation',
      text: `Hello ${user.username}, your password has been successfully reset.`,
      html: `<h1>Password Reset Confirmation</h1>
      <p>Hello ${user.username},</p>
      <p>Your password has been successfully reset.</p>`,
    });
  }
}

export default new UserService();
