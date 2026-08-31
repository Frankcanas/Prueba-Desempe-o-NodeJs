import { IClinicAttributes } from './clinic.interface';
import { IWarehouseAttributes } from './warehouse.interface';
import { IMedicineAttributes } from './medicine.interface';
import { IUserResponse } from './user.interface';

export type RequestStatus = 'Pendiente' | 'Aprobada' | 'En Proceso' | 'Despachada' | 'Entregada' | 'Rechazada' | 'Cancelada';

export interface ISupplyRequestAttributes {
  id?: string;
  clinicId: string;
  warehouseId: string;
  medicineId: string;
  quantity: number;
  status: RequestStatus;
  requestedById?: string;
  notes?: string;
  clinic?: IClinicAttributes;
  warehouse?: IWarehouseAttributes;
  medicine?: IMedicineAttributes;
  requester?: IUserResponse;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateSupplyRequestDTO {
  clinicId: string;
  warehouseId: string;
  medicineId: string;
  quantity: number;
  notes?: string;
}

export interface IUpdateSupplyRequestStatusDTO {
  status: RequestStatus;
  notes?: string;
}

export interface ISupplyRequestPaginationQuery {
  page?: number;
  limit?: number;
  status?: RequestStatus;
  clinicId?: string;
  warehouseId?: string;
  medicineId?: string;
  activeOnly?: boolean;
}

export interface IPaginatedSupplyRequestsResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  requests: ISupplyRequestAttributes[];
}
