import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { IJWTPayload, UserRole } from '../interfaces/user.interface';

export interface AuthenticatedRequest extends Request {
  user?: IJWTPayload;
}

/**
 * Middleware para verificar la validez del token JWT en cabeceras de autorización
 */
export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Acceso no autorizado: Token no proporcionado o formato inválido (debe ser Bearer <token>).',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
      error: error.message,
    });
  }
};

/**
 * Middleware para autorizar el acceso basado en roles específicos
 * @param allowedRoles Lista de roles permitidos (ej. 'Administrador', 'Gestor de Solicitudes')
 */
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autenticado: Información de usuario no encontrada en la petición.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Acceso denegado: El rol '${req.user.role}' no tiene permisos para esta acción. Requiere: [${allowedRoles.join(', ')}].`,
      });
      return;
    }

    next();
  };
};
