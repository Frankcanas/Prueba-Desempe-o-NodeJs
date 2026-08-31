export type UserRole = 'Administrador' | 'Gestor de Solicitudes';

export interface IUserAttributes {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ILoginUserDTO {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IJWTPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface IAuthResponse {
  token: string;
  user: IUserResponse;
}
