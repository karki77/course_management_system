import fs from "fs";
import express from 'express';
import { PrismaClient } from '@prisma/client';

import router from './router';
import globalErrorHandler from './middleware/globalErrorHandler';

const prisma = new PrismaClient();

const PORT = process.env.PORT ?? 7000;
const app = express();


void (async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");
  } catch (error) {
    console.log(`ERROR CONNECTING DATABASE: ${(error as Error).message}`);
    console.error(error);
    process.exit(1);
  }
})();

app.use(express.json());

app.use('/api/v1', router)

app.use(globalErrorHandler);

/**
 * Only for development
 */
const directoryPath = "./uploads";
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
  

// ILoginSchema
// IRegisterSchema

/**
 * THIS CODE IS FOR : --
 */


/**
 * FOR MIGRATION CASE:
 * 1. `npx prisma migrate dev --name init` to create migration files
 */

// auth