
import { prisma } from "../../config";
import HttpException from "../../utils/api/httpException";
import { generateToken} from "../../middleware/authMiddleware";
import { hashPassword, verifyPassword } from "../../utils/password/hash";
import type { IRegisterSchema, ILoginSchema, IChangePassword, } from "../../utils/validators/validation";


export const registerUserService = async (data: IRegisterSchema) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username }
      ]
    }
  });

  // 
  if(existingUser){
    throw new HttpException(400, "Email or username already exist");
  }

  const hashedPassword = await hashPassword(data.password);
  const user=  await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role
    }
  });

  //
  return user
};

// export const getAllUsersService = async () => {
//   return await prisma.user.findMany({ include: { profile: true, courses: true } });
// };


export const loginUserService = async (data: ILoginSchema) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new HttpException(401, "Invalid credentials");
  }

  const isPasswordValid = await verifyPassword(user.password, data.password);
  if (!isPasswordValid) {
    throw new HttpException(401, "Invalid credentialsssss");
  }

  const {accessToken, refreshToken}= generateToken(user)
  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    },
    accessToken,
    refreshToken
  };
};




export const changePasswordService = async (userId: string, data: IChangePassword) => {
   const user = await prisma.user.findUnique({
    where:{id: userId}
   });

   // !USER THROW -> HTTPEXCEPTION
   if(!user){
    throw new HttpException(404, "User not found");
   }

   // user.password, data.oldPassword -> check compare.
   const isOldPassordValid = await verifyPassword(user.password, data.oldPassword); 

   if(!isOldPassordValid){
    throw new HttpException(400, "Old password is incorrect");
   }

   // Check if oldPassword and newPassword are same
  if (data.oldPassword === data.newPassword) {
    throw new HttpException(400, "New password cannot be the same as the old password");
  }

  // user password -> update with hash.
  const hashedPassword = await hashPassword(data.newPassword);
   
  // update password in db
  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    }
  });
}



  // export const deleteUserService = async (userId: string) => {
  //   const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  
  //   if (!existingUser) {
  //     throw new HttpException(404, "User not found");
  //   }
  
  //   await prisma.user.delete({ where: { id: userId } });
  
  //   return {
  //     message: "User deleted successfully",
  //     userId
  //   };
  // };
  
  
