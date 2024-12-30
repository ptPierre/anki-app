import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Learning Package API',
      version: '1.0.0', 
      description: 'API documentation for the Learning Package system',
    },
    components: {
      schemas: {
        LearningPackage: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The unique identifier of the learning package',
            },
            title: {
              type: 'string',
              description: 'The title of the learning package',
            },
            description: {
              type: 'string',
              description: 'A description of the learning package',
            },
            category: {
              type: 'string',
              description: 'The category of the learning package',
            },
            targetAudience: {
              type: 'string',
              description: 'The target audience of the learning package',
            },
            difficultyLevel: {
              type: 'integer',
              description: 'The difficulty level of the learning package (1-20)',
            },
          },
          required: ['title', 'description', 'category', 'targetAudience', 'difficultyLevel'],
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Application): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
