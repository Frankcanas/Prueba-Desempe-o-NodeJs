import { Warehouse, WarehouseInput } from '../models/warehouse.model';
import { Transaction } from 'sequelize';

export class WarehouseRepository {
  public async findById(id: string, transaction?: Transaction): Promise<Warehouse | null> {
    return await Warehouse.findByPk(id, { transaction });
  }

  public async findByName(name: string, transaction?: Transaction): Promise<Warehouse | null> {
    return await Warehouse.findOne({ where: { name }, transaction });
  }


  public async create(warehouseData: WarehouseInput, transaction?: Transaction): Promise<Warehouse> {
    return await Warehouse.create(warehouseData, { transaction });
  }

  public async bulkCreate(warehouses: WarehouseInput[], transaction?: Transaction): Promise<Warehouse[]> {
    return await Warehouse.bulkCreate(warehouses, { validate: true, transaction });
  }

  public async findAll(onlyActive: boolean = true): Promise<Warehouse[]> {
    const where = onlyActive ? { isActive: true } : {};
    return await Warehouse.findAll({ where, order: [['createdAt', 'DESC']] });
  }

  public async update(id: string, updateData: Partial<WarehouseInput>, transaction?: Transaction): Promise<[number, Warehouse[]]> {
    return await Warehouse.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
  }

  public async softDelete(id: string, transaction?: Transaction): Promise<[number, Warehouse[]]> {
    return await Warehouse.update(
      { isActive: false },
      { where: { id }, returning: true, transaction }
    );
  }
}

export const warehouseRepository = new WarehouseRepository();
