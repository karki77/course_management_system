import express from 'express';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

import router from './router';
import globalErrorHandler from './middleware/globalErrorHandler';

const prisma = new PrismaClient();

const PORT = process.env.PORT ?? 7000;
const app = express();

// ✅ Custom morgan token for timestamp
morgan.token('timestamp', () => new Date().toISOString());

// ✅ Morgan format string
const morganFormat =
  ':method :url :status :res[content-length] - :response-time ms [:timestamp]';

// ✅ Enable morgan logging for all requests
app.use(morgan(morganFormat));

void (async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully.');
  } catch (error) {
    console.log(`ERROR CONNECTING DATABASE: ${(error as Error).message}`);
    console.error(error);
    process.exit(1);
  }
})();

app.use(express.json());
app.use('/api/v1', router);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
