/**
 * swagger ma esari esari documentation.
 */

// 2 hours -> 30 min.

// web socket // socket.io

// DOCS

// RADIS
// DOCS


import swaggerJSDoc from 'swagger-jsdoc';

/**
 * Swagger configuration
 * 
 * For Route Documentation:
 * 1. router in this file: ./src/router
 */
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
