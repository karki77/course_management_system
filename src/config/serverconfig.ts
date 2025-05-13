import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Course Management System API',
      version: '1.0.0',
      description: 'API documentation for Course Management System',
    },
  },
  apis: [
    './src/router/*.ts',        // Routes like userRouter.ts
    './src/modules/**/*.ts',    // Controller/module logic
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);


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
