import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RiwiMediCare Plus API',
      version: '1.0.0',
      description: 'Documentación interactiva de la API REST para la gestión de solicitudes de abastecimiento de medicamentos e insumos médicos.',
      contact: {
        name: 'Soporte RiwiMediCare',
        email: 'soporte@riwimedicare.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local de Desarrollo',
      },
      {
        url: '/',
        description: 'Ruta relativa actual',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Introduce el token JWT en el formato: Bearer <token>',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.ts').replace(/\\/g, '/'),
    path.join(__dirname, '../routes/*.js').replace(/\\/g, '/'),
    path.join(__dirname, '../../src/routes/*.ts').replace(/\\/g, '/'),
    path.join(__dirname, '../../dist/routes/*.js').replace(/\\/g, '/'),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
