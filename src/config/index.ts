import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
//// src/config/index.ts
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default {
  database: {
    url: process.env.DATABASE_URL,
  },
  server: {
    port: process.env.PORT || 9000,
  },
  jwt: {
    accessSecret: process.env.JWT_SECRET_ACCESS || 'default-access-secret',
    refreshSecret: process.env.JWT_SECRET_REFRESH || 'default-refresh-secret',
  },
  // Add other config settings here
};

