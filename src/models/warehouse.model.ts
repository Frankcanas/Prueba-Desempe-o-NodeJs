import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { IWarehouseAttributes } from '../interfaces/warehouse.interface';

export interface WarehouseInput extends Optional<IWarehouseAttributes, 'id' | 'capacity' | 'isActive' | 'createdAt' | 'updatedAt'> {}
export interface WarehouseOutput extends Required<IWarehouseAttributes> {}

export class Warehouse extends Model<IWarehouseAttributes, WarehouseInput> implements IWarehouseAttributes {
  public declare id: string;
  public declare name: string;
  public declare location: string;
  public declare capacity: number;
  public declare isActive: boolean;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

Warehouse.init(
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
    location: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000,
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
    tableName: 'warehouses',
    timestamps: true,
  }
);
