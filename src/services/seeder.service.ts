import bcrypt from 'bcrypt';
import { sequelize } from '../config/database';
import { ISeedData, ISeedResult } from '../interfaces/seeder.interface';
import { userRepository, UserRepository } from '../repositories/user.repository';
import { clinicRepository, ClinicRepository } from '../repositories/clinic.repository';
import { warehouseRepository, WarehouseRepository } from '../repositories/warehouse.repository';
import { medicineRepository, MedicineRepository } from '../repositories/medicine.repository';

export class SeederService {
  private userRepo: UserRepository;
  private clinicRepo: ClinicRepository;
  private warehouseRepo: WarehouseRepository;
  private medicineRepo: MedicineRepository;

  constructor() {
    this.userRepo = userRepository;
    this.clinicRepo = clinicRepository;
    this.warehouseRepo = warehouseRepository;
    this.medicineRepo = medicineRepository;
  }

  /**
   * Procesa y puebla la base de datos de manera masiva a partir de un objeto JSON estructurado (US 03)
   * @param data Datos base a sembrar
   */
  public async seedFromJson(data: ISeedData): Promise<ISeedResult> {
    const transaction = await sequelize.transaction();

    let usersInserted = 0;
    let clinicsInserted = 0;
    let warehousesInserted = 0;
    let medicinesInserted = 0;

    try {
      // 1. Población de Almacenes (Warehouses)
      const warehouseMap = new Map<string, string>(); // mapeo de nombre/id -> id real
      if (data.warehouses && Array.isArray(data.warehouses)) {
        for (const wh of data.warehouses) {
          let existing = null;
          if (wh.id) {
            existing = await this.warehouseRepo.findById(wh.id, transaction);
          }
          if (!existing && wh.name) {
            existing = await this.warehouseRepo.findByName(wh.name);
          }

          if (!existing) {
            const created = await this.warehouseRepo.create(
              {
                id: wh.id,
                name: wh.name,
                location: wh.location,
                capacity: wh.capacity || 1000,
                isActive: true,
              },
              transaction
            );
            warehouseMap.set(created.name, created.id);
            if (wh.id) warehouseMap.set(wh.id, created.id);
            warehousesInserted++;
          } else {
            warehouseMap.set(existing.name, existing.id);
            if (wh.id) warehouseMap.set(wh.id, existing.id);
          }
        }
      }

      // 2. Población de Usuarios (Users)
      if (data.users && Array.isArray(data.users)) {
        for (const u of data.users) {
          const existingUser = await this.userRepo.findByEmail(u.email, transaction);
          if (!existingUser) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(u.password, saltRounds);
            await this.userRepo.create(
              {
                name: u.name,
                email: u.email.toLowerCase().trim(),
                password: hashedPassword,
                role: u.role,
                isActive: true,
              },
              transaction
            );
            usersInserted++;
          }
        }
      }

      // 3. Población de Clínicas (Clinics)
      if (data.clinics && Array.isArray(data.clinics)) {
        for (const c of data.clinics) {
          const existingClinic = await this.clinicRepo.findByNit(c.nit);
          if (!existingClinic) {
            await this.clinicRepo.create(
              {
                id: c.id,
                name: c.name,
                nit: c.nit,
                address: c.address,
                phone: c.phone,
                managerName: c.managerName,
                isActive: true,
              },
              transaction
            );
            clinicsInserted++;
          }
        }
      }

      // 4. Población de Medicamentos (Medicines)
      if (data.medicines && Array.isArray(data.medicines)) {
        for (const m of data.medicines) {
          const existingMedicine = await this.medicineRepo.findByCode(m.code);
          if (!existingMedicine) {
            // Resolver almacén asociado
            let resolvedWarehouseId = m.warehouseId;
            if (!resolvedWarehouseId && m.warehouseName) {
              resolvedWarehouseId = warehouseMap.get(m.warehouseName);
            }
            if (!resolvedWarehouseId && warehouseMap.size > 0) {
              resolvedWarehouseId = warehouseMap.values().next().value;
            }

            if (!resolvedWarehouseId) {
              throw new Error(`No se encontró un almacén válido para el medicamento con código ${m.code}`);
            }

            await this.medicineRepo.create(
              {
                id: m.id,
                name: m.name,
                code: m.code,
                description: m.description || '',
                unitPrice: m.unitPrice,
                stock: m.stock,
                warehouseId: resolvedWarehouseId,
                isActive: true,
              },
              transaction
            );
            medicinesInserted++;
          }
        }
      }

      await transaction.commit();

      return {
        usersInserted,
        clinicsInserted,
        warehousesInserted,
        medicinesInserted,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export const seederService = new SeederService();
