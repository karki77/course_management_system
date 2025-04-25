import { PrismaClient } from "@prisma/client";
import HttpException from "../../utils/api/httpException";
import { generateToken} from "../../middleware/authMiddleware";
import { hashPassword, verifyPassword } from "../../utils/password/hash";

import type { IRegisterSchema, ILoginSchema, IUpdateSchema} from "../../utils/validators/validation";
export const prisma = new PrismaClient();

export const registerUserService = async (data: IRegisterSchema) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username }
      ]
    }
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      throw new HttpException(400, "Email already exists");
    }
    if (existingUser.username === data.username) {
      throw new HttpException(400, "Username already exists");
    }
  }

  const hashedPassword = await hashPassword(data.password);

  return await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role
    }
  });
};

export const getAllUsersService = async () => {
  return await prisma.user.findMany({ include: { profile: true, courses: true } });
};

// here i need to  add the login service
export const loginUserService = async (data: ILoginSchema) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new HttpException(401, "Invalid credentials");
  }

  // Compare password using Argon2
  const isPasswordValid = await verifyPassword(data.password, user.password);
  
  if (!isPasswordValid) {
    throw new HttpException(401, "Invalid credentials");
  }

// Generate JWT token
const token = generateToken({
  id: user.id,
  email: user.email,
  role: user.role
});

    // Return user (without password) and token
  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    },
    token
  };
};


export const updateUserService = async (userId: string, data: IUpdateSchema) => {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  
     
    if (!existingUser) {
      throw new HttpException(404, "User not found");
    }
    // If password is being updated, hash it
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data
    });
  
    return {
      user: {
        username: updatedUser.username,
        role: updatedUser.role
      }
    };
};

  export const deleteUserService = async (userId: string) => {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  
    if (!existingUser) {
      throw new HttpException(404, "User not found");
    }
  
    await prisma.user.delete({ where: { id: userId } });
  
    return {
      message: "User deleted successfully",
      userId
    };
  };
  
  
