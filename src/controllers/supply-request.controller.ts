import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { supplyRequestService } from '../services/supply-request.service';

export class SupplyRequestController {
  /**
   * Registra una nueva solicitud de abastecimiento (US 06)
   * POST /api/v1/supply-requests
   */
  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestedById = req.user?.id;
      const supplyRequest = await supplyRequestService.createSupplyRequest(req.body, requestedById);

      res.status(201).json({
        success: true,
        message: 'Solicitud de abastecimiento registrada exitosamente.',
        data: supplyRequest,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Actualiza el estado del ciclo de vida de una solicitud existente (US 07)
   * PATCH /api/v1/supply-requests/:id/status
   */
  public updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedRequest = await supplyRequestService.updateSupplyRequestStatus(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Estado de la solicitud actualizado exitosamente.',
        data: updatedRequest,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene la lista de solicitudes de abastecimiento (US 08)
   * GET /api/v1/supply-requests
   */
  public getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await supplyRequestService.getAllSupplyRequests(req.query);
      res.status(200).json({
        success: true,
        message: 'Listado de solicitudes de abastecimiento obtenido exitosamente.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene el historial de solicitudes por clínica (US 08)
   * GET /api/v1/supply-requests/clinic/:clinicId
   */
  public getByClinic = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clinicId } = req.params;
      const result = await supplyRequestService.getSupplyRequestsByClinic(clinicId, req.query);
      res.status(200).json({
        success: true,
        message: 'Historial de solicitudes de la clínica obtenido exitosamente.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene una solicitud de abastecimiento por su ID (US 08)
   * GET /api/v1/supply-requests/:id
   */
  public getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const supplyRequest = await supplyRequestService.getSupplyRequestById(id);
      res.status(200).json({
        success: true,
        message: 'Solicitud de abastecimiento encontrada exitosamente.',
        data: supplyRequest,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const supplyRequestController = new SupplyRequestController();
