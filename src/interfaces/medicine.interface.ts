import { IWarehouseAttributes } from './warehouse.interface';

export interface IMedicineAttributes {
  id?: string;
  name: string;
  code: string;
  description?: string;
  unitPrice: number;
  stock: number;
  warehouseId: string;
  warehouse?: IWarehouseAttributes;
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

export interface IMedicinePaginationQuery {
  page?: number;
  limit?: number;
  warehouseId?: string;
  all?: boolean;
}

export interface IPaginatedMedicinesResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  medicines: IMedicineAttributes[];
}
