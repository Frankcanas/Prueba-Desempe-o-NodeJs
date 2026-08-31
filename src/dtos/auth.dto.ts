import { ILoginUserDTO, IRegisterUserDTO, UserRole } from '../interfaces/user.interface';

export class AuthDTO {
  /**
   * Valida los datos recibidos en la petición de registro de usuario (US 01)
   * @param data Objeto con los datos de registro
   */
  public static validateRegister(data: any): { isValid: boolean; message?: string; value?: IRegisterUserDTO } {
    const { name, email, password, role } = data;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return { isValid: false, message: 'El nombre es obligatorio y debe tener al menos 2 caracteres.' };
    }

    if (!email || typeof email !== 'string') {
      return { isValid: false, message: 'El correo electrónico es obligatorio.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { isValid: false, message: 'El formato del correo electrónico no es válido.' };
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return { isValid: false, message: 'La contraseña es obligatoria y debe tener al menos 6 caracteres.' };
    }

    const validRoles: UserRole[] = ['Administrador', 'Gestor de Solicitudes'];
    if (!role || !validRoles.includes(role)) {
      return { isValid: false, message: 'El rol debe ser "Administrador" o "Gestor de Solicitudes".' };
    }

    return {
      isValid: true,
      value: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      },
    };
  }

  /**
   * Valida los datos recibidos en la petición de inicio de sesión (US 02)
   * @param data Objeto con las credenciales de inicio de sesión
   */
  public static validateLogin(data: any): { isValid: boolean; message?: string; value?: ILoginUserDTO } {
    const { email, password } = data;

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return { isValid: false, message: 'El correo electrónico es obligatorio.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { isValid: false, message: 'El formato del correo electrónico no es válido.' };
    }

    if (!password || typeof password !== 'string' || password.length === 0) {
      return { isValid: false, message: 'La contraseña es obligatoria.' };
    }

    return {
      isValid: true,
      value: {
        email: email.trim().toLowerCase(),
        password,
      },
    };
  }
}
