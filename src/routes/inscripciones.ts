// src/routes/inscripciones.ts
import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import * as inscripcionController from '../controllers/inscripcion.controller';

const router = Router();

// ==================== ESTUDIANTE ====================
router.post('/solicitar', authenticate, inscripcionController.solicitar);
router.get('/mis-activas', authenticate, inscripcionController.getMisActivas);
router.get('/mis-pendientes', authenticate, inscripcionController.getMisPendientes);
router.delete('/cancelar/:id', authenticate, inscripcionController.cancelarActiva); // cambia estado a cancelada

// ==================== ADMIN ====================
router.get('/pendientes', authenticate, requireRole('admin'), inscripcionController.getPendientes);
router.patch('/aprobar/:id', authenticate, requireRole('admin'), inscripcionController.aprobar);
router.patch('/rechazar/:id', authenticate, requireRole('admin'), inscripcionController.rechazar);
router.get('/todas', authenticate, requireRole('admin'), inscripcionController.getAll);

// ==================== INSTRUCTOR ====================
router.get('/instructor/mis-inscripciones', authenticate, requireRole('instructor'), inscripcionController.getMisInscripcionesInstructor);

export default router;