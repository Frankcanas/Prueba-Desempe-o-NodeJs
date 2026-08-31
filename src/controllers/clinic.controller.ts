import { Request, Response, NextFunction } from 'express';
import { clinicService } from '../services/clinic.service';

export class ClinicController {
  /**
   * Registra una nueva clínica (US 04)
   * POST /api/v1/clinics
   */
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clinic = await clinicService.createClinic(req.body);
      res.status(201).json({
        success: true,
        message: 'Clínica registrada exitosamente.',
        data: clinic,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene la lista de clínicas (US 04)
   * GET /api/v1/clinics
   */
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await clinicService.getAllClinics(req.query);
      res.status(200).json({
        success: true,
        message: 'Listado de clínicas obtenido exitosamente.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene una clínica por su ID (US 04)
   * GET /api/v1/clinics/:id
   */
  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const clinic = await clinicService.getClinicById(id);
      res.status(200).json({
        success: true,
        message: 'Clínica encontrada exitosamente.',
        data: clinic,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Actualiza los datos de una clínica (US 04)
   * PUT /api/v1/clinics/:id
   */
  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedClinic = await clinicService.updateClinic(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Clínica actualizada exitosamente.',
        data: updatedClinic,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Elimina lógicamente una clínica (US 04)
   * DELETE /api/v1/clinics/:id
   */
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await clinicService.deleteClinic(id);
      res.status(200).json({
        success: true,
        message: 'Clínica eliminada lógicamente con éxito (is_active = false).',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const clinicController = new ClinicController();
