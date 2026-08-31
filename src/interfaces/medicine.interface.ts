export interface IMedicineAttributes {
  id?: string;
  name: string;
  code: string;
  description?: string;
  unitPrice: number;
  stock: number;
  warehouseId: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateMedicineDTO {
  name: string;
  code: string;
  description?: string;
  unitPrice: number;
  stock: number;
  warehouseId: string;
}

export interface IUpdateMedicineDTO {
  name?: string;
  code?: string;
  description?: string;
  unitPrice?: number;
  stock?: number;
  warehouseId?: string;
  isActive?: boolean;
}
