import { warehouseRepository } from '../repositories/warehouse.repository';
import {
  ICreateWarehouseDTO,
  IUpdateWarehouseDTO,
  IWarehousePaginationQuery,
  IPaginatedWarehousesResponse,
} from '../interfaces/warehouse.interface';
import { Warehouse } from '../models/warehouse.model';

export class WarehouseService {
  /**
   * Registra un nuevo almacén validando nombre y capacidad (US 05)
   */
  public async createWarehouse(dto: ICreateWarehouseDTO): Promise<Warehouse> {
    const { name, location, capacity } = dto;

    if (!name || !location) {
      const error: any = new Error('Los campos name y location son obligatorios.');
      error.statusCode = 400;
      throw error;
    }

    const cleanName = name.trim();
    const existing = await warehouseRepository.findByName(cleanName);
    if (existing) {
      const error: any = new Error(`Ya existe un almacén registrado con el nombre: '${cleanName}'.`);
      error.statusCode = 409;
      throw error;
    }

    const parsedCapacity = capacity !== undefined ? Number(capacity) : 1000;
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      const error: any = new Error('La capacidad del almacén debe ser un número entero mayor a 0.');
      error.statusCode = 400;
      throw error;
    }

    return await warehouseRepository.create({
      name: cleanName,
      location: location.trim(),
      capacity: parsedCapacity,
      isActive: true,
    });
  }

  /**
   * Obtiene la lista de almacenes con soporte de paginación y filtro de activos (US 05)
   */
  public async getAllWarehouses(query: IWarehousePaginationQuery): Promise<IPaginatedWarehousesResponse> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const onlyActive = String(query.all) !== 'true';
    const offset = (page - 1) * limit;

    const { count, rows } = await warehouseRepository.findAndCountAll({
      onlyActive,
      limit,
      offset,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
      warehouses: rows,
    };
  }

  /**
   * Obtiene un almacén por su ID (UUID) incluyendo sus medicamentos disponibles (US 05)
   */
  public async getWarehouseById(id: string): Promise<Warehouse> {
    const warehouse = await warehouseRepository.findById(id);
    if (!warehouse) {
      const error: any = new Error(`No se encontró ningún almacén con el ID: ${id}.`);
      error.statusCode = 404;
      throw error;
    }
    return warehouse;
  }

  /**
   * Actualiza los datos de un almacén existente (US 05)
   */
  public async updateWarehouse(id: string, dto: IUpdateWarehouseDTO): Promise<Warehouse> {
    const existing = await warehouseRepository.findById(id);
    if (!existing) {
      const error: any = new Error(`No se encontró ningún almacén con el ID: ${id}.`);
      error.statusCode = 404;
      throw error;
    }

    if (dto.name && dto.name.trim() !== existing.name) {
      const cleanName = dto.name.trim();
      const duplicateName = await warehouseRepository.findByName(cleanName, id);
      if (duplicateName) {
        const error: any = new Error(`Ya existe otro almacén registrado con el nombre: '${cleanName}'.`);
        error.statusCode = 409;
        throw error;
      }
      dto.name = cleanName;
    }

    if (dto.capacity !== undefined) {
      const parsedCapacity = Number(dto.capacity);
      if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
        const error: any = new Error('La capacidad del almacén debe ser un número entero mayor a 0.');
        error.statusCode = 400;
        throw error;
      }
      dto.capacity = parsedCapacity;
    }

    const updated = await warehouseRepository.update(id, dto);
    return updated!;
  }

  /**
   * Elimina lógicamente un almacén estableciendo isActive = false (US 05)
   */
  public async deleteWarehouse(id: string): Promise<{ id: string; name: string; isActive: boolean }> {
    const existing = await warehouseRepository.findById(id);
    if (!existing) {
      const error: any = new Error(`No se encontró ningún almacén con el ID: ${id}.`);
      error.statusCode = 404;
      throw error;
    }

    await warehouseRepository.softDelete(id);

    return {
      id: existing.id,
      name: existing.name,
      isActive: false,
    };
  }
}

export const warehouseService = new WarehouseService();
