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
