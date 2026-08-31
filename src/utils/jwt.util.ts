import jwt, { SignOptions } from 'jsonwebtoken';
import { IJWTPayload } from '../interfaces/user.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '2h') as string;

/**
 * Genera un nuevo JSON Web Token firmado con los datos del usuario (US 02)
 * @param payload Información del usuario a incluir en el token
 */
export const generateToken = (payload: IJWTPayload): string => {
  const signOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any,
  };

  return jwt.sign(payload, JWT_SECRET, signOptions);
};

/**
 * Verifica y decodifica un JSON Web Token
 * @param token Token JWT en formato Bearer o string
 */
export const verifyToken = (token: string): IJWTPayload => {
  return jwt.verify(token, JWT_SECRET) as IJWTPayload;
};
