import { IRegisterUserDTO } from './user.interface';
import { ICreateClinicDTO } from './clinic.interface';
import { ICreateWarehouseDTO } from './warehouse.interface';

export interface ISeedMedicineItem {
  id?: string;
  name: string;
  code: string;
  description?: string;
  unitPrice: number;
  stock: number;
  warehouseId?: string;
  warehouseName?: string;
}

export interface ISeedData {
  users?: IRegisterUserDTO[];
  clinics?: (ICreateClinicDTO & { id?: string })[];
  warehouses?: (ICreateWarehouseDTO & { id?: string })[];
  medicines?: ISeedMedicineItem[];
}

export interface ISeedResult {
  usersInserted: number;
  clinicsInserted: number;
  warehousesInserted: number;
  medicinesInserted: number;
}
