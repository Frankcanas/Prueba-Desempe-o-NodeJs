import { Request, Response, NextFunction } from 'express';
import { warehouseService } from '../services/warehouse.service';

export class WarehouseController {
  /**
   * Registra un nuevo almacén (US 05)
   * POST /api/v1/warehouses
   */
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const warehouse = await warehouseService.createWarehouse(req.body);
      res.status(201).json({
        success: true,
        message: 'Almacén registrado exitosamente.',
        data: warehouse,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene el listado de almacenes (US 05)
   * GET /api/v1/warehouses
   */
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await warehouseService.getAllWarehouses(req.query);
      res.status(200).json({
        success: true,
        message: 'Listado de almacenes obtenido exitosamente.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene un almacén por su ID (US 05)
   * GET /api/v1/warehouses/:id
   */
  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const warehouse = await warehouseService.getWarehouseById(id);
      res.status(200).json({
        success: true,
        message: 'Almacén encontrado exitosamente.',
        data: warehouse,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Actualiza los datos de un almacén (US 05)
   * PUT /api/v1/warehouses/:id
   */
  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedWarehouse = await warehouseService.updateWarehouse(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Almacén actualizado exitosamente.',
        data: updatedWarehouse,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Elimina lógicamente un almacén (US 05)
   * DELETE /api/v1/warehouses/:id
   */
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await warehouseService.deleteWarehouse(id);
      res.status(200).json({
        success: true,
        message: 'Almacén eliminado lógicamente con éxito (is_active = false).',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const warehouseController = new WarehouseController();
