import { Request, Response, NextFunction } from 'express';
import { seederService, SeederService } from '../services/seeder.service';
import { ISeedData } from '../interfaces/seeder.interface';

export class SeederController {
  private seederSvc: SeederService;

  constructor() {
    this.seederSvc = seederService;
  }

  /**
   * Endpoint para la carga masiva de datos iniciales mediante archivo JSON (US 03)
   * @route POST /api/v1/seeders/upload
   */
  public uploadSeeders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Debe adjuntar un archivo en formato JSON en el campo "file".',
        });
        return;
      }

      let parsedData: ISeedData;
      try {
        const fileContent = req.file.buffer.toString('utf-8');
        parsedData = JSON.parse(fileContent);
      } catch (parseError) {
        res.status(400).json({
          success: false,
          message: 'El archivo adjunto no contiene un formato JSON válido.',
        });
        return;
      }

      const result = await this.seederSvc.seedFromJson(parsedData);

      res.status(201).json({
        success: true,
        message: 'Base de datos poblada exitosamente mediante Seeder.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const seederController = new SeederController();
