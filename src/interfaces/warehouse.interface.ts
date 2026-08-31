export interface IWarehouseAttributes {
  id?: string;
  name: string;
  location: string;
  capacity?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateWarehouseDTO {
  name: string;
  location: string;
  capacity?: number;
}

export interface IUpdateWarehouseDTO {
  name?: string;
  location?: string;
  capacity?: number;
  isActive?: boolean;
}

export interface IWarehousePaginationQuery {
  page?: number;
  limit?: number;
  all?: boolean;
}

export interface IPaginatedWarehousesResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  warehouses: IWarehouseAttributes[];
}
