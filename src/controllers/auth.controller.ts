import { Request, Response, NextFunction } from 'express';
import { authService, AuthService } from '../services/auth.service';
import { AuthDTO } from '../dtos/auth.dto';

export class AuthController {
  private authSvc: AuthService;

  constructor() {
    this.authSvc = authService;
  }

  /**
   * Endpoint público para el registro de nuevos usuarios (US 01)
   * @route POST /api/v1/auth/register
   */
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = AuthDTO.validateRegister(req.body);
      if (!validation.isValid || !validation.value) {
        res.status(400).json({
          success: false,
          message: validation.message,
        });
        return;
      }

      const user = await this.authSvc.register(validation.value);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente.',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * Endpoint público para el inicio de sesión de usuarios (US 02)
   * @route POST /api/v1/auth/login
   */
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = AuthDTO.validateLogin(req.body);
      if (!validation.isValid || !validation.value) {
        res.status(400).json({
          success: false,
          message: validation.message,
        });
        return;
      }

      const authData = await this.authSvc.login(validation.value);

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso.',
        data: authData,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
