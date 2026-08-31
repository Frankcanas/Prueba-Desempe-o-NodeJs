import { SupplyRequest, SupplyRequestInput, Clinic, Warehouse, Medicine, User } from '../models';
import { Transaction } from 'sequelize';

export class SupplyRequestRepository {
  /**
   * Obtiene las inclusiones estándar con modelos asociados para consultas de solicitudes
   */
  private getStandardIncludes() {
    return [
      {
        model: Clinic,
        as: 'clinic',
        attributes: ['id', 'name', 'nit', 'address', 'phone', 'managerName', 'isActive'],
      },
      {
        model: Warehouse,
        as: 'warehouse',
        attributes: ['id', 'name', 'location', 'capacity', 'isActive'],
      },
      {
        model: Medicine,
        as: 'medicine',
        attributes: ['id', 'name', 'code', 'unitPrice', 'stock', 'isActive'],
      },
      {
        model: User,
        as: 'requester',
        attributes: ['id', 'name', 'email', 'role', 'isActive'],
      },
    ];
  }

  /**
   * Busca una solicitud de abastecimiento por su ID (UUID) con todas sus relaciones
   */
  public async findById(id: string, transaction?: Transaction): Promise<SupplyRequest | null> {
    return await SupplyRequest.findByPk(id, {
      include: this.getStandardIncludes(),
      transaction,
    });
  }

  /**
   * Registra una nueva solicitud de abastecimiento
   */
  public async create(data: SupplyRequestInput, transaction?: Transaction): Promise<SupplyRequest> {
    return await SupplyRequest.create(data, { transaction });
  }

  /**
   * Obtiene la lista de solicitudes con filtros y paginación
   */
  public async findAndCountAll(options?: {
    where?: any;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
  }): Promise<{ count: number; rows: SupplyRequest[] }> {
    return await SupplyRequest.findAndCountAll({
      where: options?.where || {},
      include: this.getStandardIncludes(),
      limit: options?.limit,
      offset: options?.offset,
      order: [['createdAt', 'DESC']],
      transaction: options?.transaction,
    });
  }

  /**
   * Consulta el historial de solicitudes realizadas por una clínica específica
   */
  public async findByClinicId(
    clinicId: string,
    options?: { limit?: number; offset?: number; transaction?: Transaction }
  ): Promise<{ count: number; rows: SupplyRequest[] }> {
    return await SupplyRequest.findAndCountAll({
      where: { clinicId },
      include: this.getStandardIncludes(),
      limit: options?.limit,
      offset: options?.offset,
      order: [['createdAt', 'DESC']],
      transaction: options?.transaction,
    });
  }

  /**
   * Actualiza el estado o información de una solicitud existente
   */
  public async update(
    id: string,
    updateData: Partial<SupplyRequestInput>,
    transaction?: Transaction
  ): Promise<SupplyRequest | null> {
    const request = await SupplyRequest.findByPk(id, { transaction });
    if (!request) return null;
    return await request.update(updateData, { transaction });
  }
}

export const supplyRequestRepository = new SupplyRequestRepository();
