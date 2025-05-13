// src/utils/swagger/swaggerUi.ts
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './index';
import { Express } from 'express';

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
