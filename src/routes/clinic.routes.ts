import { Router } from 'express';
import { clinicController } from '../controllers/clinic.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de Clínicas requieren autenticación JWT y rol Administrador
router.use(authenticateJWT, authorizeRoles('Administrador'));

/**
 * @swagger
 * tags:
 *   name: Clínicas
 *   description: Endpoints para la gestión y administración del directorio de clínicas (US 04)
 */

/**
 * @swagger
 * /api/v1/clinics:
 *   post:
 *     summary: Registrar una nueva clínica (US 04)
 *     tags: [Clínicas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - nit
 *               - address
 *               - phone
 *               - managerName
 *             properties:
 *               name:
 *                 type: string
 *                 example: Clínica Las Américas Riwi
 *               nit:
 *                 type: string
 *                 example: 900123456-1
 *               address:
 *                 type: string
 *                 example: Calle 50 # 45-67, Medellín
 *               phone:
 *                 type: string
 *                 example: +57 604 1234567
 *               managerName:
 *                 type: string
 *                 example: Dra. María Fernanda López
 *     responses:
 *       201:
 *         description: Clínica registrada exitosamente.
 *       400:
 *         description: Faltan campos obligatorios o formato inválido.
 *       401:
 *         description: No autenticado (Token no enviado o inválido).
 *       403:
 *         description: Acceso denegado (Requiere rol Administrador).
 *       409:
 *         description: Conflicto (Ya existe una clínica registrada con el mismo NIT).
 */
router.post('/', clinicController.create);

/**
 * @swagger
 * /api/v1/clinics:
 *   get:
 *     summary: Listar todas las clínicas con paginación (US 04)
 *     tags: [Clínicas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de clínicas por página
 *       - in: query
 *         name: all
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Si es true incluye también clínicas inactivas
 *     responses:
 *       200:
 *         description: Listado de clínicas obtenido exitosamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado (Requiere rol Administrador).
 */
router.get('/', clinicController.getAll);

/**
 * @swagger
 * /api/v1/clinics/{id}:
 *   get:
 *     summary: Obtener los detalles de una clínica por ID (US 04)
 *     tags: [Clínicas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único UUID de la clínica
 *     responses:
 *       200:
 *         description: Clínica encontrada exitosamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Clínica no encontrada con el ID proporcionado.
 */
router.get('/:id', clinicController.getById);

/**
 * @swagger
 * /api/v1/clinics/{id}:
 *   put:
 *     summary: Actualizar la información de una clínica existente (US 04)
 *     tags: [Clínicas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único UUID de la clínica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Clínica Las Américas Riwi Norte
 *               nit:
 *                 type: string
 *                 example: 900123456-1
 *               address:
 *                 type: string
 *                 example: Carrera 70 # 10-20, Medellín
 *               phone:
 *                 type: string
 *                 example: +57 604 7654321
 *               managerName:
 *                 type: string
 *                 example: Dr. Roberto Gómez
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Clínica actualizada exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Clínica no encontrada.
 *       409:
 *         description: Ya existe otra clínica con el nuevo NIT especificado.
 */
router.put('/:id', clinicController.update);

/**
 * @swagger
 * /api/v1/clinics/{id}:
 *   delete:
 *     summary: Eliminación lógica de una clínica (Soft Delete) (US 04)
 *     tags: [Clínicas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único UUID de la clínica
 *     responses:
 *       200:
 *         description: Clínica eliminada lógicamente con éxito (is_active = false).
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Clínica no encontrada.
 */
router.delete('/:id', clinicController.delete);

export default router;
