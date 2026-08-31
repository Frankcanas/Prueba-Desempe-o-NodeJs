import { Medicine, MedicineInput, Warehouse } from '../models';
import { Transaction, Op } from 'sequelize';

export class MedicineRepository {
  /**
   * Busca un medicamento por su ID (UUID) incluyendo datos de su almacén
   */
  public async findById(id: string, transaction?: Transaction): Promise<Medicine | null> {
    return await Medicine.findByPk(id, {
      include: [
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name', 'location', 'capacity', 'isActive'],
        },
      ],
      transaction,
    });
  }

  /**
   * Busca un medicamento por su código único
   */
  public async findByCode(code: string, excludeId?: string, transaction?: Transaction): Promise<Medicine | null> {
    const where: any = { code };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    return await Medicine.findOne({ where, transaction });
  }

  /**
   * Registra un nuevo medicamento
   */
  public async create(medicineData: MedicineInput, transaction?: Transaction): Promise<Medicine> {
    return await Medicine.create(medicineData, { transaction });
  }

  /**
   * Inserta múltiples medicamentos en bloque (usado por Seeders)
   */
  public async bulkCreate(medicines: MedicineInput[], transaction?: Transaction): Promise<Medicine[]> {
    return await Medicine.bulkCreate(medicines, { validate: true, transaction });
  }

  /**
   * Obtiene la lista de medicamentos paginada con filtros
   */
  public async findAndCountAll(options?: {
    onlyActive?: boolean;
    warehouseId?: string;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
  }): Promise<{ count: number; rows: Medicine[] }> {
    const where: any = {};
    if (options?.onlyActive) {
      where.isActive = true;
    }
    if (options?.warehouseId) {
      where.warehouseId = options.warehouseId;
    }

    return await Medicine.findAndCountAll({
      where,
      include: [
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name', 'location', 'isActive'],
        },
      ],
      limit: options?.limit,
      offset: options?.offset,
      order: [['createdAt', 'DESC']],
      transaction: options?.transaction,
    });
  }

  /**
   * Actualiza los datos de un medicamento existente
   */
  public async update(
    id: string,
    updateData: Partial<MedicineInput>,
    transaction?: Transaction
  ): Promise<Medicine | null> {
    const medicine = await Medicine.findByPk(id, { transaction });
    if (!medicine) return null;
    return await medicine.update(updateData, { transaction });
  }

  /**
   * Realiza eliminación lógica (soft delete) cambiando isActive = false
   */
  public async softDelete(id: string, transaction?: Transaction): Promise<Medicine | null> {
    const medicine = await Medicine.findByPk(id, { transaction });
    if (!medicine) return null;
    return await medicine.update({ isActive: false }, { transaction });
  }
}

export const medicineRepository = new MedicineRepository();
