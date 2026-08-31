import { Router } from 'express';
import { supplyRequestController } from '../controllers/supply-request.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de Solicitudes requieren autenticación JWT
router.use(authenticateJWT);

/**
 * @swagger
 * tags:
 *   name: Solicitudes de Abastecimiento
 *   description: Endpoints para la gestión y ciclo de vida de solicitudes de abastecimiento médico (US 06, US 07, US 08)
 */

/**
 * @swagger
 * /api/v1/supply-requests:
 *   post:
 *     summary: Registrar una nueva solicitud de abastecimiento (US 06)
 *     description: Permite a Gestores de Solicitudes y Administradores solicitar medicamentos para una clínica verificando stock disponible en el almacén.
 *     tags: [Solicitudes de Abastecimiento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clinicId
 *               - warehouseId
 *               - medicineId
 *               - quantity
 *             properties:
 *               clinicId:
 *                 type: string
 *                 format: uuid
 *                 example: 5b0d168a-4226-411b-a5c0-47dcdf080b75
 *               warehouseId:
 *                 type: string
 *                 format: uuid
 *                 example: cb9e5f0c-fa85-4589-85ae-f8e7b212203e
 *               medicineId:
 *                 type: string
 *                 format: uuid
 *                 example: b19ccb3f-5472-46e3-b556-12930f6684e1
 *               quantity:
 *                 type: integer
 *                 example: 100
 *                 description: Cantidad de unidades solicitadas (debe ser mayor a 0 y menor o igual al stock disponible)
 *               notes:
 *                 type: string
 *                 example: Requerimiento urgente para servicio de urgencias
 *     responses:
 *       201:
 *         description: Solicitud de abastecimiento registrada exitosamente con estado Pendiente.
 *       400:
 *         description: Datos requeridos faltantes, cantidad inválida o stock insuficiente en inventario.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Clínica, almacén o medicamento no encontrado.
 */
router.post(
  '/',
  authorizeRoles('Administrador', 'Gestor de Solicitudes'),
  supplyRequestController.create
);

/**
 * @swagger
 * /api/v1/supply-requests:
 *   get:
 *     summary: Listar todas las solicitudes de abastecimiento con filtros y paginación (US 08)
 *     description: Consulta accesible por todos los usuarios autenticados. Soporta filtro de solo solicitudes activas.
 *     tags: [Solicitudes de Abastecimiento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pendiente, En Proceso, Aprobada, Despachada, Entregada, Rechazada, Cancelada]
 *       - in: query
 *         name: clinicId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: activeOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Si es true, retorna únicamente solicitudes en estados no terminales (Pendiente, En Proceso, Aprobada, Despachada).
 *     responses:
 *       200:
 *         description: Listado de solicitudes obtenido exitosamente.
 *       401:
 *         description: No autenticado.
 */
router.get(
  '/',
  authorizeRoles('Administrador', 'Gestor de Solicitudes'),
  supplyRequestController.getAll
);

/**
 * @swagger
 * /api/v1/supply-requests/clinic/{clinicId}:
 *   get:
 *     summary: Consultar el historial completo de solicitudes realizadas por una clínica (US 08)
 *     description: Permite consultar la trazabilidad histórica de todas las solicitudes emitidas por una clínica determinada.
 *     tags: [Solicitudes de Abastecimiento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único UUID de la clínica
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pendiente, En Proceso, Aprobada, Despachada, Entregada, Rechazada, Cancelada]
 *     responses:
 *       200:
 *         description: Historial de solicitudes de la clínica obtenido exitosamente.
 *       401:
 *         description: No autenticado.
 *       404:
 *         description: Clínica no encontrada.
 */
router.get(
  '/clinic/:clinicId',
  authorizeRoles('Administrador', 'Gestor de Solicitudes'),
  supplyRequestController.getByClinic
);

/**
 * @swagger
 * /api/v1/supply-requests/{id}:
 *   get:
 *     summary: Obtener los detalles completos de una solicitud por ID (US 08)
 *     tags: [Solicitudes de Abastecimiento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Solicitud encontrada exitosamente.
 *       401:
 *         description: No autenticado.
 *       404:
 *         description: Solicitud no encontrada.
 */
router.get(
  '/:id',
  authorizeRoles('Administrador', 'Gestor de Solicitudes'),
  supplyRequestController.getById
);

/**
 * @swagger
 * /api/v1/supply-requests/{id}/status:
 *   patch:
 *     summary: Actualizar el estado del ciclo de vida de una solicitud (US 07)
 *     description: Permite avanzar o cancelar una solicitud validando estados permitidos y descontando automáticamente el inventario en aprobación/despacho.
 *     tags: [Solicitudes de Abastecimiento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador único UUID de la solicitud
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pendiente, En Proceso, Aprobada, Despachada, Entregada, Rechazada, Cancelada]
 *                 example: Aprobada
 *               notes:
 *                 type: string
 *                 example: Solicitud aprobada y autorizada para empaque
 *     responses:
 *       200:
 *         description: Estado de la solicitud actualizado exitosamente.
 *       400:
 *         description: Estado inválido, transición no permitida o stock insuficiente para aprobación.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Solicitud no encontrada.
 */
router.patch(
  '/:id/status',
  authorizeRoles('Administrador', 'Gestor de Solicitudes'),
  supplyRequestController.updateStatus
);

router.put(
  '/:id/status',
  authorizeRoles('Administrador', 'Gestor de Solicitudes'),
  supplyRequestController.updateStatus
);

export default router;
