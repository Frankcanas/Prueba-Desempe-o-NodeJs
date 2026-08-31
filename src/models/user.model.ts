import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { IUserAttributes, UserRole } from '../interfaces/user.interface';

export interface UserInput extends Optional<IUserAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {}
export interface UserOutput extends Required<IUserAttributes> {}

export class User extends Model<IUserAttributes, UserInput> implements IUserAttributes {
  public declare id: string;
  public declare name: string;
  public declare email: string;
  public declare password: string;
  public declare role: UserRole;
  public declare isActive: boolean;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Administrador', 'Gestor de Solicitudes'),
      allowNull: false,
      defaultValue: 'Gestor de Solicitudes',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);
