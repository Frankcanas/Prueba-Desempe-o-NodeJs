import { Router } from 'express';
import { warehouseController } from '../controllers/warehouse.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de Almacenes requieren autenticación JWT y rol Administrador
router.use(authenticateJWT, authorizeRoles('Administrador'));

/**
 * @swagger
 * tags:
 *   name: Almacenes
 *   description: Endpoints para la gestión y administración de almacenes de almacenamiento (US 05)
 */

/**
 * @swagger
 * /api/v1/warehouses:
 *   post:
 *     summary: Registrar un nuevo almacén (US 05)
 *     tags: [Almacenes]
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
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: Almacén Occidente San Javier
 *               location:
 *                 type: string
 *                 example: Carrera 99 # 45-12, Medellín
 *               capacity:
 *                 type: integer
 *                 example: 15000
 *     responses:
 *       201:
 *         description: Almacén registrado exitosamente.
 *       400:
 *         description: Datos requeridos faltantes o capacidad inválida.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado (Requiere rol Administrador).
 *       409:
 *         description: Ya existe un almacén con el mismo nombre.
 */
router.post('/', warehouseController.create);

/**
 * @swagger
 * /api/v1/warehouses:
 *   get:
 *     summary: Listar todos los almacenes con paginación (US 05)
 *     tags: [Almacenes]
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
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: all
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Incluir también almacenes inactivos
 *     responses:
 *       200:
 *         description: Listado de almacenes obtenido exitosamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 */
router.get('/', warehouseController.getAll);

/**
 * @swagger
 * /api/v1/warehouses/{id}:
 *   get:
 *     summary: Obtener los detalles de un almacén por ID con sus medicamentos (US 05)
 *     tags: [Almacenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único UUID del almacén
 *     responses:
 *       200:
 *         description: Almacén encontrado exitosamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Almacén no encontrado.
 */
router.get('/:id', warehouseController.getById);

/**
 * @swagger
 * /api/v1/warehouses/{id}:
 *   put:
 *     summary: Actualizar la información de un almacén (US 05)
 *     tags: [Almacenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único UUID del almacén
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Almacén Occidente Principal
 *               location:
 *                 type: string
 *                 example: Calle San Juan # 80-50, Medellín
 *               capacity:
 *                 type: integer
 *                 example: 25000
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Almacén actualizado exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Almacén no encontrado.
 *       409:
 *         description: Conflicto de nombre de almacén.
 */
router.put('/:id', warehouseController.update);

/**
 * @swagger
 * /api/v1/warehouses/{id}:
 *   delete:
 *     summary: Eliminación lógica de un almacén (Soft Delete) (US 05)
 *     tags: [Almacenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único UUID del almacén
 *     responses:
 *       200:
 *         description: Almacén eliminado lógicamente con éxito (is_active = false).
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Almacén no encontrado.
 */
router.delete('/:id', warehouseController.delete);

export default router;
