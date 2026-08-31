import { supplyRequestRepository } from '../repositories/supply-request.repository';
import { clinicRepository } from '../repositories/clinic.repository';
import { warehouseRepository } from '../repositories/warehouse.repository';
import { medicineRepository } from '../repositories/medicine.repository';
import {
  ICreateSupplyRequestDTO,
  IUpdateSupplyRequestStatusDTO,
  ISupplyRequestPaginationQuery,
  IPaginatedSupplyRequestsResponse,
  RequestStatus,
} from '../interfaces/supply-request.interface';
import { SupplyRequest, Medicine } from '../models';
import { sequelize } from '../config/database';
import { Op } from 'sequelize';

export class SupplyRequestService {
  /**
   * Registra una nueva solicitud de abastecimiento de medicamentos (US 06)
   * Valida existencia de clínica, almacén, medicamento y disponibilidad de inventario.
   */
  public async createSupplyRequest(dto: ICreateSupplyRequestDTO, requestedById?: string): Promise<SupplyRequest> {
    const { clinicId, warehouseId, medicineId, quantity, notes } = dto;

    // 1. Validación de campos obligatorios
    if (!clinicId || !warehouseId || !medicineId || quantity === undefined) {
      const error: any = new Error('Los campos clinicId, warehouseId, medicineId y quantity son obligatorios.');
      error.statusCode = 400;
      throw error;
    }

    // 2. Validación de cantidad solicitada mayor a cero (> 0)
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || !Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      const error: any = new Error('La cantidad solicitada debe ser un número entero mayor a 0.');
      error.statusCode = 400;
      throw error;
    }

    // 3. Validación de existencia y estado de la Clínica
    const clinic = await clinicRepository.findById(clinicId);
    if (!clinic) {
      const error: any = new Error(`La clínica con ID '${clinicId}' no existe.`);
      error.statusCode = 404;
      throw error;
    }
    if (!clinic.isActive) {
      const error: any = new Error(`La clínica '${clinic.name}' se encuentra inactiva.`);
      error.statusCode = 400;
      throw error;
    }

    // 4. Validación de existencia y estado del Almacén
    const warehouse = await warehouseRepository.findById(warehouseId);
    if (!warehouse) {
      const error: any = new Error(`El almacén con ID '${warehouseId}' no existe.`);
      error.statusCode = 404;
      throw error;
    }
    if (!warehouse.isActive) {
      const error: any = new Error(`El almacén '${warehouse.name}' se encuentra inactivo.`);
      error.statusCode = 400;
      throw error;
    }

    // 5. Validación de existencia y estado del Medicamento
    const medicine = await medicineRepository.findById(medicineId);
    if (!medicine) {
      const error: any = new Error(`El medicamento con ID '${medicineId}' no existe.`);
      error.statusCode = 404;
      throw error;
    }
    if (!medicine.isActive) {
      const error: any = new Error(`El medicamento '${medicine.name}' se encuentra inactivo.`);
      error.statusCode = 400;
      throw error;
    }

    // 6. Validación de pertenencia del medicamento al almacén indicado
    if (medicine.warehouseId !== warehouseId) {
      const error: any = new Error(
        `El medicamento '${medicine.name}' no está alojado en el almacén '${warehouse.name}'.`
      );
      error.statusCode = 400;
      throw error;
    }

    // 7. Validación de disponibilidad suficiente en inventario
    if (medicine.stock < parsedQuantity) {
      const error: any = new Error(
        `Inventario insuficiente en el almacén '${warehouse.name}'. Stock disponible de '${medicine.name}': ${medicine.stock}, Cantidad requerida: ${parsedQuantity}.`
      );
      error.statusCode = 400;
      throw error;
    }

    // 8. Creación de la solicitud con estado inicial 'Pendiente'
    const newRequest = await supplyRequestRepository.create({
      clinicId,
      warehouseId,
      medicineId,
      quantity: parsedQuantity,
      status: 'Pendiente',
      requestedById,
      notes: notes ? notes.trim() : undefined,
    });

    return (await supplyRequestRepository.findById(newRequest.id))!;
  }

  /**
   * Actualiza el estado de una solicitud de abastecimiento existente (US 07)
   * Valida estados permitidos, transiciones de ciclo de vida y descuenta/reintegra stock con transacciones ACID.
   */
  public async updateSupplyRequestStatus(
    id: string,
    dto: IUpdateSupplyRequestStatusDTO
  ): Promise<SupplyRequest> {
    const { status, notes } = dto;

    if (!status) {
      const error: any = new Error('El campo status es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    const VALID_STATUSES: RequestStatus[] = [
      'Pendiente',
      'En Proceso',
      'Aprobada',
      'Despachada',
      'Entregada',
      'Rechazada',
      'Cancelada',
    ];

    if (!VALID_STATUSES.includes(status)) {
      const error: any = new Error(
        `Estado '${status}' no válido. Los estados permitidos son: ${VALID_STATUSES.join(', ')}.`
      );
      error.statusCode = 400;
      throw error;
    }

    return await sequelize.transaction(async (transaction) => {
      // 1. Buscar la solicitud existente
      const request = await SupplyRequest.findByPk(id, { transaction });
      if (!request) {
        const error: any = new Error(`No se encontró ninguna solicitud de abastecimiento con el ID: ${id}.`);
        error.statusCode = 404;
        throw error;
      }

      const currentStatus = request.status;

      // 2. Si ya está en estado terminal, no permitir modificaciones
      const TERMINAL_STATUSES: RequestStatus[] = ['Entregada', 'Rechazada', 'Cancelada'];
      if (TERMINAL_STATUSES.includes(currentStatus)) {
        const error: any = new Error(
          `La solicitud ya se encuentra en estado terminal '${currentStatus}' y no puede ser modificada.`
        );
        error.statusCode = 400;
        throw error;
      }

      // 3. Validar mapa de transiciones válidas
      const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
        'Pendiente': ['En Proceso', 'Aprobada', 'Rechazada', 'Cancelada'],
        'En Proceso': ['Aprobada', 'Rechazada', 'Cancelada'],
        'Aprobada': ['Despachada', 'Cancelada'],
        'Despachada': ['Entregada', 'Cancelada'],
        'Entregada': [],
        'Rechazada': [],
        'Cancelada': [],
      };

      if (status !== currentStatus && !ALLOWED_TRANSITIONS[currentStatus]?.includes(status)) {
        const error: any = new Error(
          `Transición no permitida: No se puede cambiar el estado de '${currentStatus}' a '${status}'. Transiciones permitidas desde '${currentStatus}': [${ALLOWED_TRANSITIONS[currentStatus]?.join(', ')}].`
        );
        error.statusCode = 400;
        throw error;
      }

      // 4. Lógica de control de inventario:
      // Si pasa a 'Aprobada' o 'Despachada' desde 'Pendiente' o 'En Proceso', se descuenta el stock
      const isApprovedOrDispatched = status === 'Aprobada' || status === 'Despachada';
      const wasPendingOrInProgress = currentStatus === 'Pendiente' || currentStatus === 'En Proceso';

      if (isApprovedOrDispatched && wasPendingOrInProgress) {
        const medicine = await Medicine.findByPk(request.medicineId, { transaction });
        if (!medicine) {
          const error: any = new Error('El medicamento asociado a la solicitud ya no existe.');
          error.statusCode = 404;
          throw error;
        }

        if (medicine.stock < request.quantity) {
          const error: any = new Error(
            `No es posible cambiar a '${status}'. Stock insuficiente de '${medicine.name}' (Disponible: ${medicine.stock}, Solicitado: ${request.quantity}).`
          );
          error.statusCode = 400;
          throw error;
        }

        await medicine.update({ stock: medicine.stock - request.quantity }, { transaction });
      }

      // Si una solicitud previamente Aprobada o Despachada se Cancela, reintegrar el stock
      const isCancelled = status === 'Cancelada';
      const wasApprovedOrDispatched = currentStatus === 'Aprobada' || currentStatus === 'Despachada';

      if (isCancelled && wasApprovedOrDispatched) {
        const medicine = await Medicine.findByPk(request.medicineId, { transaction });
        if (medicine) {
          await medicine.update({ stock: medicine.stock + request.quantity }, { transaction });
        }
      }

      // 5. Actualizar la solicitud
      await request.update(
        {
          status,
          notes: notes !== undefined ? notes.trim() : request.notes,
        },
        { transaction }
      );

      return (await supplyRequestRepository.findById(id, transaction))!;
    });
  }

  /**
   * Obtiene la lista de solicitudes de abastecimiento paginada con filtros (US 08)
   */
  public async getAllSupplyRequests(query: ISupplyRequestPaginationQuery): Promise<IPaginatedSupplyRequestsResponse> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const offset = (page - 1) * limit;

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.clinicId) {
      where.clinicId = query.clinicId;
    }
    if (query.warehouseId) {
      where.warehouseId = query.warehouseId;
    }
    if (query.medicineId) {
      where.medicineId = query.medicineId;
    }

    // Filtro de solo activas (solicitudes no finalizadas / no canceladas)
    if (query.activeOnly === true || String(query.activeOnly) === 'true') {
      where.status = { [Op.notIn]: ['Entregada', 'Rechazada', 'Cancelada'] };
    }

    const { count, rows } = await supplyRequestRepository.findAndCountAll({
      where,
      limit,
      offset,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
      requests: rows,
    };
  }

  /**
   * Obtiene el historial completo de requerimientos por clínica (US 08)
   */
  public async getSupplyRequestsByClinic(
    clinicId: string,
    query: ISupplyRequestPaginationQuery
  ): Promise<IPaginatedSupplyRequestsResponse & { clinic: any }> {
    const clinic = await clinicRepository.findById(clinicId);
    if (!clinic) {
      const error: any = new Error(`La clínica con ID '${clinicId}' no existe.`);
      error.statusCode = 404;
      throw error;
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const offset = (page - 1) * limit;

    const where: any = { clinicId };
    if (query.status) {
      where.status = query.status;
    }

    const { count, rows } = await supplyRequestRepository.findAndCountAll({
      where,
      limit,
      offset,
    });

    return {
      clinic: {
        id: clinic.id,
        name: clinic.name,
        nit: clinic.nit,
        managerName: clinic.managerName,
      },
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
      requests: rows,
    };
  }

  /**
   * Obtiene los detalles de una solicitud por su ID (US 08)
   */
  public async getSupplyRequestById(id: string): Promise<SupplyRequest> {
    const request = await supplyRequestRepository.findById(id);
    if (!request) {
      const error: any = new Error(`No se encontró ninguna solicitud con el ID: ${id}.`);
      error.statusCode = 404;
      throw error;
    }
    return request;
  }
}

export const supplyRequestService = new SupplyRequestService();
