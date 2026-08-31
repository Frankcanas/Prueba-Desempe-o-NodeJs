import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  errors?: any;
}

/**
 * Middleware global para la captura y formateo estandarizado de errores
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor.';

  // Manejo de errores de validación y restricciones de Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors && err.errors.length > 0 ? err.errors[0].message : 'Error de validación en la base de datos.';
  }

  // Manejo de errores de subida de archivos de Multer
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = `Error en el archivo cargado: ${err.message}`;
  }

  // Manejo de errores de sintaxis JSON
  if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'El cuerpo de la solicitud no es un JSON válido.';
  }

  console.error(`[Error Handler] ${req.method} ${req.originalUrl} - Status: ${statusCode} - Message: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
