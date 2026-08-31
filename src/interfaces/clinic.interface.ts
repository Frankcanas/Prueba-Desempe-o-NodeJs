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
  nit?: string;
  address?: string;
  phone?: string;
  managerName?: string;
  isActive?: boolean;
}

export interface IClinicPaginationQuery {
  page?: number;
  limit?: number;
  all?: boolean;
}

export interface IPaginatedClinicsResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  clinics: IClinicAttributes[];
}
