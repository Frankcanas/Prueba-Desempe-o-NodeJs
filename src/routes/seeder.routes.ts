import { Router } from 'express';
import { seederController } from '../controllers/seeder.controller';
import { uploadJson } from '../middlewares/upload.middleware';

const router = Router();

/**
 * @swagger
 * /api/v1/seeders/upload:
 *   post:
 *     summary: Carga masiva de datos iniciales mediante archivo JSON con Multer (US 03)
 *     tags: [Seeders]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JSON con datos de usuarios, clínicas, almacenes y medicamentos.
 *     responses:
 *       201:
 *         description: Base de datos poblada exitosamente.
 *       400:
 *         description: Archivo no proporcionado o formato JSON inválido.
 *       500:
 *         description: Error interno al procesar e insertar los datos.
 */
router.post('/upload', uploadJson.single('file'), seederController.uploadSeeders);

export default router;
