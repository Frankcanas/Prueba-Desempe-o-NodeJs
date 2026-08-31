import { Router } from 'express';
import { medicineController } from '../controllers/medicine.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de Medicamentos requieren autenticación JWT y rol Administrador
router.use(authenticateJWT, authorizeRoles('Administrador'));

/**
 * @swagger
 * tags:
 *   name: Medicamentos
 *   description: Endpoints para el control y administración del inventario de medicamentos (US 05)
 */

/**
 * @swagger
 * /api/v1/medicines:
 *   post:
 *     summary: Registrar un nuevo medicamento en inventario (US 05)
 *     tags: [Medicamentos]
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
 *               - code
 *               - unitPrice
 *               - stock
 *               - warehouseId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ceftriaxona 1g Frasco Vial
 *               code:
 *                 type: string
 *                 example: MED-CEF-100
 *               description:
 *                 type: string
 *                 example: Antibiótico betalactámico bactericida para infecciones graves.
 *               unitPrice:
 *                 type: number
 *                 example: 24500.50
 *               stock:
 *                 type: integer
 *                 example: 600
 *               warehouseId:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       201:
 *         description: Medicamento registrado exitosamente.
 *       400:
 *         description: Datos requeridos faltantes, precio o stock inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado (Requiere rol Administrador).
 *       404:
 *         description: El almacén especificado no existe.
 *       409:
 *         description: Ya existe un medicamento registrado con el mismo código.
 */
router.post('/', medicineController.create);

/**
 * @swagger
 * /api/v1/medicines:
 *   get:
 *     summary: Listar todos los medicamentos con filtros y paginación (US 05)
 *     tags: [Medicamentos]
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
 *         name: warehouseId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar medicamentos por almacén específico
 *       - in: query
 *         name: all
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Incluir también medicamentos inactivos
 *     responses:
 *       200:
 *         description: Listado de medicamentos obtenido exitosamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 */
router.get('/', medicineController.getAll);

/**
 * @swagger
 * /api/v1/medicines/{id}:
 *   get:
 *     summary: Obtener los detalles de un medicamento por ID (US 05)
 *     tags: [Medicamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único UUID del medicamento
 *     responses:
 *       200:
 *         description: Medicamento encontrado exitosamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Medicamento no encontrado.
 */
router.get('/:id', medicineController.getById);

/**
 * @swagger
 * /api/v1/medicines/{id}:
 *   put:
 *     summary: Actualizar la información y stock de un medicamento (US 05)
 *     tags: [Medicamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único UUID del medicamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ceftriaxona 1g Polvo Inyectable
 *               code:
 *                 type: string
 *                 example: MED-CEF-100
 *               description:
 *                 type: string
 *                 example: Antibiótico cefalosporínico de tercera generación.
 *               unitPrice:
 *                 type: number
 *                 example: 26000.00
 *               stock:
 *                 type: integer
 *                 example: 850
 *               warehouseId:
 *                 type: string
 *                 format: uuid
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Medicamento actualizado exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Medicamento o almacén no encontrado.
 *       409:
 *         description: Conflicto de código único de medicamento.
 */
router.put('/:id', medicineController.update);

/**
 * @swagger
 * /api/v1/medicines/{id}:
 *   delete:
 *     summary: Eliminación lógica de un medicamento (Soft Delete) (US 05)
 *     tags: [Medicamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único UUID del medicamento
 *     responses:
 *       200:
 *         description: Medicamento eliminado lógicamente con éxito (is_active = false).
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Medicamento no encontrado.
 */
router.delete('/:id', medicineController.delete);

export default router;
