import { Router } from 'express';
import authRoutes from './auth.routes';
import seederRoutes from './seeder.routes';

const router = Router();

// Rutas de Autenticación (US 01, US 02)
router.use('/auth', authRoutes);

// Rutas de Carga Inicial / Seeders (US 03)
router.use('/seeders', seederRoutes);

export default router;

