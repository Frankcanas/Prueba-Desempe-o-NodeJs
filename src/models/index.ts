import { User, UserInput, UserOutput } from './user.model';
import { Clinic, ClinicInput, ClinicOutput } from './clinic.model';
import { Warehouse, WarehouseInput, WarehouseOutput } from './warehouse.model';
import { Medicine, MedicineInput, MedicineOutput } from './medicine.model';
import { SupplyRequest, SupplyRequestInput, SupplyRequestOutput } from './supply-request.model';

// --- Asociaciones de Modelos (Sequelize Relationships) ---

// Relación Almacén <-> Medicamentos (1 a N)
Warehouse.hasMany(Medicine, { foreignKey: 'warehouseId', as: 'medicines' });
Medicine.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });

// Relación Clínica <-> Solicitudes de Abastecimiento (1 a N)
Clinic.hasMany(SupplyRequest, { foreignKey: 'clinicId', as: 'supplyRequests' });
SupplyRequest.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic' });

// Relación Almacén <-> Solicitudes de Abastecimiento (1 a N)
Warehouse.hasMany(SupplyRequest, { foreignKey: 'warehouseId', as: 'supplyRequests' });
SupplyRequest.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });

// Relación Medicamento <-> Solicitudes de Abastecimiento (1 a N)
Medicine.hasMany(SupplyRequest, { foreignKey: 'medicineId', as: 'supplyRequests' });
SupplyRequest.belongsTo(Medicine, { foreignKey: 'medicineId', as: 'medicine' });

// Relación Usuario <-> Solicitudes de Abastecimiento (1 a N)
User.hasMany(SupplyRequest, { foreignKey: 'requestedById', as: 'supplyRequests' });
SupplyRequest.belongsTo(User, { foreignKey: 'requestedById', as: 'requester' });

export {
  User,
  UserInput,
  UserOutput,
  Clinic,
  ClinicInput,
  ClinicOutput,
  Warehouse,
  WarehouseInput,
  WarehouseOutput,
  Medicine,
  MedicineInput,
  MedicineOutput,
  SupplyRequest,
  SupplyRequestInput,
  SupplyRequestOutput,
};
