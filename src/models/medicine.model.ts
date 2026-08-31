import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { IMedicineAttributes } from '../interfaces/medicine.interface';

export interface MedicineInput extends Optional<IMedicineAttributes, 'id' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'> {}
export interface MedicineOutput extends Required<IMedicineAttributes> {}

export class Medicine extends Model<IMedicineAttributes, MedicineInput> implements IMedicineAttributes {
  public declare id: string;
  public declare name: string;
  public declare code: string;
  public declare description?: string;
  public declare unitPrice: number;
  public declare stock: number;
  public declare warehouseId: string;
  public declare isActive: boolean;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

Medicine.init(
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
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'unit_price',
      get() {
        const rawValue = this.getDataValue('unitPrice');
        return rawValue ? parseFloat(rawValue as any) : 0;
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'warehouse_id',
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
    tableName: 'medicines',
    timestamps: true,
  }
);
