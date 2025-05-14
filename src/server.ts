import express, { static as serveStatic } from 'express';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import config from './config/envConfig';
import router from './router';
import globalErrorHandler from './middleware/globalErrorHandler';
import { setupSwagger } from './utils/swagger/swaggerUi'; // 👈 one simple import
import path from 'path';

const prisma = new PrismaClient();
const PORT = config.server.port || 9000;
const app = express();

setupSwagger(app);

//
const projectRoot = path.join(__dirname, '..');
const uploadsPath = path.join(projectRoot, 'uploads');
app.use('/uploads', serveStatic(uploadsPath));

//  Custom morgan token for timestamp
morgan.token('timestamp', () => new Date().toISOString());

//  Morgan format string
const morganFormat =
  ':method :url :status :res[content-length] - :response-time ms [:timestamp]';

//  Enable morgan logging for all requests
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
