import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de verificación de estado (Healthcheck)
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'RiwiMediCare Plus API está en línea.',
    timestamp: new Date().toISOString(),
  });
});

// Documentación Swagger interactiva
app.get('/api/docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Enrutador de la API (v1 y general)
app.use('/api/v1', apiRoutes);
app.use('/api', apiRoutes);

// Manejador de rutas no encontradas (404)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Recurso no encontrado.',
  });
});

// Middleware global de manejo de errores
app.use(errorHandler);

export default app;

