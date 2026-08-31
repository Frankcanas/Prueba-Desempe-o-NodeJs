import bcrypt from 'bcrypt';
import { IAuthResponse, ILoginUserDTO, IRegisterUserDTO, IUserAttributes, IUserResponse } from '../interfaces/user.interface';
import { userRepository, UserRepository } from '../repositories/user.repository';
import { generateToken } from '../utils/jwt.util';

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = userRepository;
  }

  /**
   * Registra un nuevo usuario en el sistema (US 01)
   * @param registerDTO Datos validados del usuario a registrar
   */
  public async register(registerDTO: IRegisterUserDTO): Promise<IUserResponse> {
    const existingUser = await this.userRepo.findByEmail(registerDTO.email);
    if (existingUser) {
      const error: any = new Error('El correo electrónico ya se encuentra registrado.');
      error.statusCode = 409;
      throw error;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDTO.password, saltRounds);

    const newUser = await this.userRepo.create({
      name: registerDTO.name,
      email: registerDTO.email,
      password: hashedPassword,
      role: registerDTO.role,
      isActive: true,
    });

    const userJson = newUser.toJSON() as IUserAttributes;

    return {
      id: userJson.id!,
      name: userJson.name,
      email: userJson.email,
      role: userJson.role,
      isActive: userJson.isActive ?? true,
      createdAt: userJson.createdAt,
      updatedAt: userJson.updatedAt,
    };
  }

  /**
   * Autentica un usuario y genera un token JWT (US 02)
   * @param loginDTO Credenciales del usuario
   */
  public async login(loginDTO: ILoginUserDTO): Promise<IAuthResponse> {
    const user = await this.userRepo.findByEmail(loginDTO.email);
    if (!user) {
      const error: any = new Error('Credenciales incorrectas.');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error: any = new Error('El usuario se encuentra inactivo. Contacte al administrador.');
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(loginDTO.password, user.password);
    if (!isPasswordValid) {
      const error: any = new Error('Credenciales incorrectas.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

export const authService = new AuthService();
