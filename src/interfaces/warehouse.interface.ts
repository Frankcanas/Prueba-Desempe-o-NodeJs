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
