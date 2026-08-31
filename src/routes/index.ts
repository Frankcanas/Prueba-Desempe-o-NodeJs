import { Router } from 'express';
import authRoutes from './auth.routes';
import seederRoutes from './seeder.routes';
import clinicRoutes from './clinic.routes';
import warehouseRoutes from './warehouse.routes';
import medicineRoutes from './medicine.routes';
import supplyRequestRoutes from './supply-request.routes';

const router = Router();

// Rutas de Autenticación (US 01, US 02)
router.use('/auth', authRoutes);

// Rutas de Carga Inicial / Seeders (US 03)
router.use('/seeders', seederRoutes);

// Rutas de Clínicas (US 04)
router.use('/clinics', clinicRoutes);

// Rutas de Almacenes y Medicamentos (US 05)
router.use('/warehouses', warehouseRoutes);
router.use('/medicines', medicineRoutes);

// Rutas de Solicitudes de Abastecimiento (US 06, US 07, US 08)
router.use('/supply-requests', supplyRequestRoutes);

export default router;
