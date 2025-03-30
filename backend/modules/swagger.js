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
    }
  },
  apis: [
//    './modules/swagger-docs/admin.js',
//    './modules/swagger-docs/auth.js',
//    './modules/swagger-docs/user.js',
//    './server.js',
    './modules/swagger-docs/full-api.js'
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
