import { Medicine, MedicineInput } from '../models/medicine.model';
import { Warehouse } from '../models/warehouse.model';
import { Transaction } from 'sequelize';

export class MedicineRepository {
  public async findById(id: string, transaction?: Transaction): Promise<Medicine | null> {
    return await Medicine.findByPk(id, {
      include: [{ model: Warehouse, as: 'warehouse', attributes: ['id', 'name', 'location'] }],
      transaction,
    });
  }

  public async findByCode(code: string, transaction?: Transaction): Promise<Medicine | null> {
    return await Medicine.findOne({ where: { code }, transaction });
  }


  public async create(medicineData: MedicineInput, transaction?: Transaction): Promise<Medicine> {
    return await Medicine.create(medicineData, { transaction });
  }

  public async bulkCreate(medicines: MedicineInput[], transaction?: Transaction): Promise<Medicine[]> {
    return await Medicine.bulkCreate(medicines, { validate: true, transaction });
  }

  public async findAll(onlyActive: boolean = true): Promise<Medicine[]> {
    const where = onlyActive ? { isActive: true } : {};
    return await Medicine.findAll({
      where,
      include: [{ model: Warehouse, as: 'warehouse', attributes: ['id', 'name', 'location'] }],
      order: [['createdAt', 'DESC']],
    });
  }

  public async update(id: string, updateData: Partial<MedicineInput>, transaction?: Transaction): Promise<[number, Medicine[]]> {
    return await Medicine.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
  }

  public async softDelete(id: string, transaction?: Transaction): Promise<[number, Medicine[]]> {
    return await Medicine.update(
      { isActive: false },
      { where: { id }, returning: true, transaction }
    );
  }
}

export const medicineRepository = new MedicineRepository();
