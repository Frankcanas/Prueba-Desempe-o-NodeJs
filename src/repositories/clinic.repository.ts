import { Clinic, ClinicInput } from '../models/clinic.model';
import { Transaction } from 'sequelize';

export class ClinicRepository {
  public async findById(id: string, transaction?: Transaction): Promise<Clinic | null> {
    return await Clinic.findByPk(id, { transaction });
  }

  public async findByNit(nit: string, transaction?: Transaction): Promise<Clinic | null> {
    return await Clinic.findOne({ where: { nit }, transaction });
  }


  public async create(clinicData: ClinicInput, transaction?: Transaction): Promise<Clinic> {
    return await Clinic.create(clinicData, { transaction });
  }

  public async bulkCreate(clinics: ClinicInput[], transaction?: Transaction): Promise<Clinic[]> {
    return await Clinic.bulkCreate(clinics, { validate: true, transaction });
  }

  public async findAll(onlyActive: boolean = true): Promise<Clinic[]> {
    const where = onlyActive ? { isActive: true } : {};
    return await Clinic.findAll({ where, order: [['createdAt', 'DESC']] });
  }

  public async update(id: string, updateData: Partial<ClinicInput>, transaction?: Transaction): Promise<[number, Clinic[]]> {
    return await Clinic.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
  }

  public async softDelete(id: string, transaction?: Transaction): Promise<[number, Clinic[]]> {
    return await Clinic.update(
      { isActive: false },
      { where: { id }, returning: true, transaction }
    );
  }
}

export const clinicRepository = new ClinicRepository();
