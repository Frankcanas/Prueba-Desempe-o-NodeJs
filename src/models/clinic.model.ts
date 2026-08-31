import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { IClinicAttributes } from '../interfaces/clinic.interface';

export interface ClinicInput extends Optional<IClinicAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {}
export interface ClinicOutput extends Required<IClinicAttributes> {}

export class Clinic extends Model<IClinicAttributes, ClinicInput> implements IClinicAttributes {
  public declare id: string;
  public declare name: string;
  public declare nit: string;
  public declare address: string;
  public declare phone: string;
  public declare managerName: string;
  public declare isActive: boolean;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

Clinic.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    nit: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    managerName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: 'manager_name',
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
    tableName: 'clinics',
    timestamps: true,
  }
);
