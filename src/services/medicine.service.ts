import { medicineRepository } from '../repositories/medicine.repository';
import { warehouseRepository } from '../repositories/warehouse.repository';
import {
  ICreateMedicineDTO,
  IUpdateMedicineDTO,
  IMedicinePaginationQuery,
  IPaginatedMedicinesResponse,
} from '../interfaces/medicine.interface';
import { Medicine } from '../models/medicine.model';

export class MedicineService {
  /**
   * Registra un nuevo medicamento validando almacén existente y código único (US 05)
   */
  public async createMedicine(dto: ICreateMedicineDTO): Promise<Medicine> {
    const { name, code, description, unitPrice, stock, warehouseId } = dto;

    if (!name || !code || unitPrice === undefined || stock === undefined || !warehouseId) {
      const error: any = new Error('Los campos name, code, unitPrice, stock y warehouseId son obligatorios.');
      error.statusCode = 400;
      throw error;
    }

    const parsedPrice = Number(unitPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      const error: any = new Error('El precio unitario (unitPrice) debe ser un número positivo mayor a 0.');
      error.statusCode = 400;
      throw error;
    }

    const parsedStock = Number(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      const error: any = new Error('El stock debe ser un número entero mayor o igual a 0.');
      error.statusCode = 400;
      throw error;
    }

    // Validar existencia del almacén asociado
    const warehouse = await warehouseRepository.findById(warehouseId);
    if (!warehouse) {
      const error: any = new Error(`El almacén con ID '${warehouseId}' no existe.`);
      error.statusCode = 404;
      throw error;
    }

    // Validar unicidad del código
    const cleanCode = code.trim().toUpperCase();
    const existingCode = await medicineRepository.findByCode(cleanCode);
    if (existingCode) {
      const error: any = new Error(`Ya existe un medicamento registrado con el código: '${cleanCode}'.`);
      error.statusCode = 409;
      throw error;
    }

    return await medicineRepository.create({
      name: name.trim(),
      code: cleanCode,
      description: description ? description.trim() : undefined,
      unitPrice: parsedPrice,
      stock: parsedStock,
      warehouseId,
      isActive: true,
    });
  }

  /**
   * Obtiene la lista de medicamentos paginada con filtros por almacén y estado (US 05)
   */
  public async getAllMedicines(query: IMedicinePaginationQuery): Promise<IPaginatedMedicinesResponse> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const onlyActive = String(query.all) !== 'true';
    const offset = (page - 1) * limit;

    const { count, rows } = await medicineRepository.findAndCountAll({
      onlyActive,
      warehouseId: query.warehouseId,
      limit,
      offset,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
      medicines: rows,
    };
  }

  /**
   * Obtiene un medicamento por su ID (UUID) con datos de su almacén (US 05)
   */
  public async getMedicineById(id: string): Promise<Medicine> {
    const medicine = await medicineRepository.findById(id);
    if (!medicine) {
      const error: any = new Error(`No se encontró ningún medicamento con el ID: ${id}.`);
      error.statusCode = 404;
      throw error;
    }
    return medicine;
  }

  /**
   * Actualiza la información de un medicamento validando código, almacén y valores (US 05)
   */
  public async updateMedicine(id: string, dto: IUpdateMedicineDTO): Promise<Medicine> {
    const existing = await medicineRepository.findById(id);
    if (!existing) {
      const error: any = new Error(`No se encontró ningún medicamento con el ID: ${id}.`);
      error.statusCode = 404;
      throw error;
    }

    if (dto.warehouseId && dto.warehouseId !== existing.warehouseId) {
      const warehouse = await warehouseRepository.findById(dto.warehouseId);
      if (!warehouse) {
        const error: any = new Error(`El almacén con ID '${dto.warehouseId}' no existe.`);
        error.statusCode = 404;
        throw error;
      }
    }

    if (dto.code && dto.code.trim().toUpperCase() !== existing.code) {
      const cleanCode = dto.code.trim().toUpperCase();
      const duplicateCode = await medicineRepository.findByCode(cleanCode, id);
      if (duplicateCode) {
        const error: any = new Error(`Ya existe otro medicamento registrado con el código: '${cleanCode}'.`);
        error.statusCode = 409;
        throw error;
      }
      dto.code = cleanCode;
    }

    if (dto.unitPrice !== undefined) {
      const parsedPrice = Number(dto.unitPrice);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        const error: any = new Error('El precio unitario (unitPrice) debe ser un número positivo mayor a 0.');
        error.statusCode = 400;
        throw error;
      }
      dto.unitPrice = parsedPrice;
    }

    if (dto.stock !== undefined) {
      const parsedStock = Number(dto.stock);
      if (isNaN(parsedStock) || parsedStock < 0) {
        const error: any = new Error('El stock debe ser un número entero mayor o igual a 0.');
        error.statusCode = 400;
        throw error;
      }
      dto.stock = parsedStock;
    }

    const updated = await medicineRepository.update(id, dto);
    return updated!;
  }

  /**
   * Elimina lógicamente un medicamento estableciendo isActive = false (US 05)
   */
  public async deleteMedicine(id: string): Promise<{ id: string; name: string; code: string; isActive: boolean }> {
    const existing = await medicineRepository.findById(id);
    if (!existing) {
      const error: any = new Error(`No se encontró ningún medicamento con el ID: ${id}.`);
      error.statusCode = 404;
      throw error;
    }

    await medicineRepository.softDelete(id);

    return {
      id: existing.id,
      name: existing.name,
      code: existing.code,
      isActive: false,
    };
  }
}

export const medicineService = new MedicineService();
