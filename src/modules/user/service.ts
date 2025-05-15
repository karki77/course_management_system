import HttpException from '../../utils/api/httpException';

import { prisma } from '../../config/prismaClient';
import { sendEmail } from '../../utils/email/service';
import { generateToken } from '../../middleware/authMiddleware';

import { hashPassword, verifyPassword } from '../../utils/password/hash';
import type {
  IRegisterSchema,
  ILoginSchema,
  IChangePassword,
  IUpdateProfile,
  IVerifyEmailSchema,
} from './validation';


/**
 * User Service
 */
class UserService {
  async register(data: IRegisterSchema) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new HttpException(400, 'Email or username already exist');
    }
   

    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        profile: {
          create: {
            bio: 'hello there',
            image: ' ',
          },
        },
      },
    });

  await sendEmail({
    to: user.email,
    subject: 'Welcome to our courses platform',
    text: `Hello ${user.username}, welcome to our platform!`,
    html: `<h1>Welcome ${user.username}!</h1><p>We're excited to have you join our learning platform.</p>`,
  });

  // generate verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationCode,
    },
  });
  //send email verification link
    const verificationLink = `https://your-frontend.com/verify-email?email=${user.email}&code=${verificationCode}`;
  await sendEmail({
    to: user.email,
    subject: 'Email Verification',
    text: `Hello ${user.username}, please verify your email by clicking on the following link: ${verificationLink}`,
    html: `<h1>Email Verification</h1><p>Hello ${user.username}, please verify your email by clicking on the following link: <a href="${verificationLink}">Verify Email</a></p>`,
  });

  return user;
}

  async verifyEmail(data: IVerifyEmailSchema) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    if (user.isEmailVerified) {
      throw new HttpException(400, 'Email already verified');
    } 
    if (user.verificationCode !== data.code) {
      throw new HttpException(400, 'Invalid verification code');
    }
    const verificationCode = user.verificationCode;
    await prisma.user.update({
      where: { email: data.email },
      data: {
        isEmailVerified: true,
        verificationCode: null, // clear code after successful verification
      },
    });
    return verificationCode;
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
}

//
export default new UserService();
