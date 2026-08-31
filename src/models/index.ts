import { User } from './user.model';
import { Clinic } from './clinic.model';
import { Warehouse } from './warehouse.model';
import { Medicine } from './medicine.model';
import { SupplyRequest } from './supply-request.model';

// --- Asociaciones de Modelos (Sequelize Relationships) ---

// Relación Almacén <-> Medicamentos (1 a N)
Warehouse.hasMany(Medicine, { foreignKey: 'warehouse_id', as: 'medicines' });
Medicine.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

// Relación Clínica <-> Solicitudes de Abastecimiento (1 a N)
Clinic.hasMany(SupplyRequest, { foreignKey: 'clinic_id', as: 'supplyRequests' });
SupplyRequest.belongsTo(Clinic, { foreignKey: 'clinic_id', as: 'clinic' });

// Relación Almacén <-> Solicitudes de Abastecimiento (1 a N)
Warehouse.hasMany(SupplyRequest, { foreignKey: 'warehouse_id', as: 'supplyRequests' });
SupplyRequest.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

// Relación Medicamento <-> Solicitudes de Abastecimiento (1 a N)
Medicine.hasMany(SupplyRequest, { foreignKey: 'medicine_id', as: 'supplyRequests' });
SupplyRequest.belongsTo(Medicine, { foreignKey: 'medicine_id', as: 'medicine' });

// Relación Usuario <-> Solicitudes de Abastecimiento (1 a N)
User.hasMany(SupplyRequest, { foreignKey: 'requested_by_id', as: 'supplyRequests' });
SupplyRequest.belongsTo(User, { foreignKey: 'requested_by_id', as: 'requester' });

export {
  User,
  Clinic,
  Warehouse,
  Medicine,
  SupplyRequest,
};
