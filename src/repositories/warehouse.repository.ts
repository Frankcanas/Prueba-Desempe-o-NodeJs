import { Warehouse, WarehouseInput, Medicine } from '../models';
import { Transaction, Op } from 'sequelize';

export class WarehouseRepository {
  /**
   * Busca un almacén por su ID (UUID)
   */
  public async findById(id: string, transaction?: Transaction): Promise<Warehouse | null> {
    return await Warehouse.findByPk(id, {
      include: [
        {
          model: Medicine,
          as: 'medicines',
          attributes: ['id', 'name', 'code', 'stock', 'unitPrice', 'isActive'],
          where: { isActive: true },
          required: false,
        },
      ],
      transaction,
    });
  }

  /**
   * Busca un almacén por su nombre exacto
   */
  public async findByName(name: string, excludeId?: string, transaction?: Transaction): Promise<Warehouse | null> {
    const where: any = { name };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    return await Warehouse.findOne({ where, transaction });
  }

  /**
   * Registra un nuevo almacén
   */
  public async create(warehouseData: WarehouseInput, transaction?: Transaction): Promise<Warehouse> {
    return await Warehouse.create(warehouseData, { transaction });
  }

  /**
   * Inserta múltiples almacenes en bloque (usado por Seeders)
   */
  public async bulkCreate(warehouses: WarehouseInput[], transaction?: Transaction): Promise<Warehouse[]> {
    return await Warehouse.bulkCreate(warehouses, { validate: true, transaction });
  }

  /**
   * Obtiene la lista de almacenes paginada o completa
   */
  public async findAndCountAll(options?: {
    onlyActive?: boolean;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
  }): Promise<{ count: number; rows: Warehouse[] }> {
    const where = options?.onlyActive ? { isActive: true } : {};
    return await Warehouse.findAndCountAll({
      where,
      limit: options?.limit,
      offset: options?.offset,
      order: [['createdAt', 'DESC']],
      transaction: options?.transaction,
    });
  }

  /**
   * Actualiza los datos de un almacén existente
   */
  public async update(
    id: string,
    updateData: Partial<WarehouseInput>,
    transaction?: Transaction
  ): Promise<Warehouse | null> {
    const warehouse = await Warehouse.findByPk(id, { transaction });
    if (!warehouse) return null;
    return await warehouse.update(updateData, { transaction });
  }

  /**
   * Realiza eliminación lógica (soft delete) cambiando isActive = false
   */
  public async softDelete(id: string, transaction?: Transaction): Promise<Warehouse | null> {
    const warehouse = await Warehouse.findByPk(id, { transaction });
    if (!warehouse) return null;
    return await warehouse.update({ isActive: false }, { transaction });
  }
}

export const warehouseRepository = new WarehouseRepository();
