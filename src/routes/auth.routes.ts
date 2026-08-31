import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Registro de un nuevo usuario en la plataforma (US 01)
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@riwimedicare.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ContraseñaSegura123
 *               role:
 *                 type: string
 *                 enum: [Administrador, Gestor de Solicitudes]
 *                 example: Gestor de Solicitudes
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       400:
 *         description: Datos de entrada inválidos.
 *       409:
 *         description: El correo electrónico ya se encuentra registrado.
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Inicio de sesión de usuarios y generación de JWT (US 02)
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@riwimedicare.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ContraseñaSegura123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Retorna token JWT y datos de usuario.
 *       400:
 *         description: Datos de entrada inválidos o faltantes.
 *       401:
 *         description: Credenciales incorrectas (correo o contraseña no válidos).
 *       403:
 *         description: Usuario inactivo.
 */
router.post('/login', authController.login);

export default router;
