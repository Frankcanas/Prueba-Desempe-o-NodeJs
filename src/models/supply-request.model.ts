import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { ISupplyRequestAttributes, RequestStatus } from '../interfaces/supply-request.interface';

export interface SupplyRequestInput extends Optional<ISupplyRequestAttributes, 'id' | 'status' | 'requestedById' | 'notes' | 'createdAt' | 'updatedAt'> {}
export interface SupplyRequestOutput extends Required<ISupplyRequestAttributes> {}

export class SupplyRequest extends Model<ISupplyRequestAttributes, SupplyRequestInput> implements ISupplyRequestAttributes {
  public declare id: string;
  public declare clinicId: string;
  public declare warehouseId: string;
  public declare medicineId: string;
  public declare quantity: number;
  public declare status: RequestStatus;
  public declare requestedById?: string;
  public declare notes?: string;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

SupplyRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clinicId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'clinic_id',
    },
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'warehouse_id',
    },
    medicineId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'medicine_id',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    status: {
      type: DataTypes.ENUM('Pendiente', 'Aprobada', 'En Proceso', 'Despachada', 'Entregada', 'Rechazada', 'Cancelada'),
      allowNull: false,
      defaultValue: 'Pendiente',
    },
    requestedById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'requested_by_id',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'supply_requests',
    timestamps: true,
  }
);
