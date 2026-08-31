export interface IClinicAttributes {
  id?: string;
  name: string;
  nit: string;
  address: string;
  phone: string;
  managerName: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateClinicDTO {
  name: string;
  nit: string;
  address: string;
  phone: string;
  managerName: string;
}

export interface IUpdateClinicDTO {
  name?: string;
  address?: string;
  phone?: string;
  managerName?: string;
  isActive?: boolean;
}
