import { prisma } from '../../config';
import HttpException from '../../utils/api/httpException';
import { sendEmail } from '../../utils/email/service';
import { generateToken } from '../../middleware/authMiddleware';
import { hashPassword, verifyPassword } from '../../utils/password/hash';
import {
  type IRegisterSchema,
  type ILoginSchema,
  type IChangePassword,
  type IUpdateProfile,
} from './validation';

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

    // transaction
    let emailResult;
    try {
      emailResult = await sendEmail({
        to: user.email,
        subject: 'Welcome to our courses platform',
        text: `Hello ${user.username}, welcome to our platform!`,
        html: `<h1>Welcome ${user.username}!</h1><p>We're excited to have you join our learning platform.</p>`,
      });

      // Return both user and email info
      return {
        user,
        emailInfo: {
          status: 'sent',
          messageId: emailResult.messageId,
          response: emailResult.response,
        },
      };
    } catch (error) {
      // Email failed but user was created
      return {
        user,
        emailInfo: {
          status: 'failed',
          message: 'Email could not be sent',
        },
      };
    }
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
      data.oldPassword
    );

    if (!isOldPassordValid) {
      throw new HttpException(400, 'Old password is incorrect');
    }

    // Check if oldPassword and newPassword are same
    if (data.oldPassword === data.newPassword) {
      throw new HttpException(
        400,
        'New password cannot be the same as the old password'
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

    //
    return user;
  }
}

export default new UserService();
