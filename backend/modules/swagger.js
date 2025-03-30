import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '10x Dev API',
      version: '1.0.0',
      description: 'API documentation for 10x-dev',
      contact: {
        name: 'Kevin Nguyen',
        email: 'kvnbanunu@gmail.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'https://4537api.banunu.dev/10x-dev/api/v1',
        description: 'Production server'
      },
      {
        url: 'http://localhost:' + (process.env.PORT || 3000),
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            email: {
              type: 'string',
              description: 'User email'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            is_admin: {
              type: 'integer',
              enum: [0, 1],
              description: 'Admin status (0: regular user, 1: admin)'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: [
    './modules/swagger-docs/admin.js',
    './modules/swagger-docs/auth.js',
    './modules/swagger-docs/user.js',
    './server.js',
  ]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "10x Dev API Documentation"
  }));
};

export default setupSwagger;
