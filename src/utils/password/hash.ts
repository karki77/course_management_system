import { hash, verify } from 'argon2';


export const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await hash(password);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

export const verifyPassword = async (password: string, hashedPassword: string) => {
  try {
    const isMatch = await verify(hashedPassword, password);
    return isMatch;
  } catch (error) {
    throw new Error('Error verifying password');
  }
}