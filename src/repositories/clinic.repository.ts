import { Clinic, ClinicInput } from '../models/clinic.model';
import { Transaction, Op } from 'sequelize';

export class ClinicRepository {
  /**
   * Busca una clínica por su ID (UUID)
   */
  public async findById(id: string, transaction?: Transaction): Promise<Clinic | null> {
    return await Clinic.findByPk(id, { transaction });
  }

  /**
   * Busca una clínica por su NIT para validación de unicidad
   * @param nit Número de Identificación Tributaria
   * @param excludeId ID opcional para excluir (útil al actualizar)
   */
  public async findByNit(nit: string, excludeId?: string, transaction?: Transaction): Promise<Clinic | null> {
    const where: any = { nit };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    return await Clinic.findOne({ where, transaction });
  }

  /**
   * Registra una nueva clínica en la base de datos
   */
  public async create(clinicData: ClinicInput, transaction?: Transaction): Promise<Clinic> {
    return await Clinic.create(clinicData, { transaction });
  }

  /**
   * Inserta múltiples clínicas en bloque (usado por Seeders)
   */
  public async bulkCreate(clinics: ClinicInput[], transaction?: Transaction): Promise<Clinic[]> {
    return await Clinic.bulkCreate(clinics, { validate: true, transaction });
  }

  /**
   * Obtiene la lista de clínicas paginada o completa
   */
  public async findAndCountAll(options?: {
    onlyActive?: boolean;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
  }): Promise<{ count: number; rows: Clinic[] }> {
    const where = options?.onlyActive ? { isActive: true } : {};
    return await Clinic.findAndCountAll({
      where,
      limit: options?.limit,
      offset: options?.offset,
      order: [['createdAt', 'DESC']],
      transaction: options?.transaction,
    });
  }

  /**
   * Actualiza los datos de una clínica existente
   */
  public async update(
    id: string,
    updateData: Partial<ClinicInput>,
    transaction?: Transaction
  ): Promise<Clinic | null> {
    const clinic = await Clinic.findByPk(id, { transaction });
    if (!clinic) return null;
    return await clinic.update(updateData, { transaction });
  }

  /**
   * Realiza eliminación lógica (soft delete) cambiando isActive = false
   */
  public async softDelete(id: string, transaction?: Transaction): Promise<Clinic | null> {
    const clinic = await Clinic.findByPk(id, { transaction });
    if (!clinic) return null;
    return await clinic.update({ isActive: false }, { transaction });
  }
}

export const clinicRepository = new ClinicRepository();
