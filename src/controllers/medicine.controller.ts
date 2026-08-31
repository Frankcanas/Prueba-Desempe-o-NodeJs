import { Request, Response, NextFunction } from 'express';
import { medicineService } from '../services/medicine.service';

export class MedicineController {
  /**
   * Registra un nuevo medicamento (US 05)
   * POST /api/v1/medicines
   */
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const medicine = await medicineService.createMedicine(req.body);
      res.status(201).json({
        success: true,
        message: 'Medicamento registrado exitosamente.',
        data: medicine,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene la lista de medicamentos (US 05)
   * GET /api/v1/medicines
   */
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await medicineService.getAllMedicines(req.query);
      res.status(200).json({
        success: true,
        message: 'Listado de medicamentos obtenido exitosamente.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene un medicamento por su ID (US 05)
   * GET /api/v1/medicines/:id
   */
  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const medicine = await medicineService.getMedicineById(id);
      res.status(200).json({
        success: true,
        message: 'Medicamento encontrado exitosamente.',
        data: medicine,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Actualiza los datos de un medicamento (US 05)
   * PUT /api/v1/medicines/:id
   */
  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedMedicine = await medicineService.updateMedicine(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Medicamento actualizado exitosamente.',
        data: updatedMedicine,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Elimina lógicamente un medicamento (US 05)
   * DELETE /api/v1/medicines/:id
   */
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await medicineService.deleteMedicine(id);
      res.status(200).json({
        success: true,
        message: 'Medicamento eliminado lógicamente con éxito (is_active = false).',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const medicineController = new MedicineController();
