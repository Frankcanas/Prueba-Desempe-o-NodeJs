import { clinicRepository } from '../repositories/clinic.repository';
import {
  ICreateClinicDTO,
  IUpdateClinicDTO,
  IClinicPaginationQuery,
  IPaginatedClinicsResponse,
} from '../interfaces/clinic.interface';
import { Clinic } from '../models/clinic.model';

export class ClinicService {
  /**
   * Registra una nueva clínica validando unicidad de NIT (US 04)
   */
  public async createClinic(dto: ICreateClinicDTO): Promise<Clinic> {
    const { name, nit, address, phone, managerName } = dto;

    if (!name || !nit || !address || !phone || !managerName) {
      const error: any = new Error('Todos los campos son obligatorios: name, nit, address, phone, managerName.');
      error.statusCode = 400;
      throw error;
    }

    const cleanNit = nit.trim();
    const existing = await clinicRepository.findByNit(cleanNit);
    if (existing) {
      const error: any = new Error(`Ya existe una clínica registrada con el NIT: ${cleanNit}.`);
      error.statusCode = 409;
      throw error;
    }

    return await clinicRepository.create({
      name: name.trim(),
      nit: cleanNit,
      address: address.trim(),
      phone: phone.trim(),
      managerName: managerName.trim(),
      isActive: true,
    });
  }

  /**
   * Obtiene la lista de clínicas paginada con filtro de activas (US 04)
   */
  public async getAllClinics(query: IClinicPaginationQuery): Promise<IPaginatedClinicsResponse> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const onlyActive = String(query.all) !== 'true';
    const offset = (page - 1) * limit;

    const { count, rows } = await clinicRepository.findAndCountAll({
      onlyActive,
      limit,
      offset,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
      clinics: rows,
    };
  }

  /**
   * Obtiene una clínica por su identificador único (US 04)
   */
  public async getClinicById(id: string): Promise<Clinic> {
    const clinic = await clinicRepository.findById(id);
    if (!clinic) {
      const error: any = new Error(`No se encontró ninguna clínica con el ID: ${id}.`);
      error.statusCode = 404;
      throw error;
    }
    return clinic;
  }

  /**
   * Actualiza los datos de una clínica existente validando duplicidad de NIT (US 04)
   */
  public async updateClinic(id: string, dto: IUpdateClinicDTO): Promise<Clinic> {
    const existing = await clinicRepository.findById(id);
    if (!existing) {
      const error: any = new Error(`No se encontró ninguna clínica con el ID: ${id}.`);
      error.statusCode = 404;
      throw error;
    }

    if (dto.nit && dto.nit.trim() !== existing.nit) {
      const cleanNit = dto.nit.trim();
      const duplicateNit = await clinicRepository.findByNit(cleanNit, id);
      if (duplicateNit) {
        const error: any = new Error(`Ya existe otra clínica registrada con el NIT: ${cleanNit}.`);
        error.statusCode = 409;
        throw error;
      }
      dto.nit = cleanNit;
    }

    const updated = await clinicRepository.update(id, dto);
    return updated!;
  }

  /**
   * Elimina lógicamente una clínica estableciendo isActive = false (US 04)
   */
  public async deleteClinic(id: string): Promise<{ id: string; name: string; nit: string; isActive: boolean }> {
    const existing = await clinicRepository.findById(id);
    if (!existing) {
      const error: any = new Error(`No se encontró ninguna clínica con el ID: ${id}.`);
      error.statusCode = 404;
      throw error;
    }

    await clinicRepository.softDelete(id);

    return {
      id: existing.id,
      name: existing.name,
      nit: existing.nit,
      isActive: false,
    };
  }
}

export const clinicService = new ClinicService();
