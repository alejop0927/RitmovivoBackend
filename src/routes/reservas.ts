import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import * as reservaController from '../controllers/reserva.controller';

const router = Router();

router.get('/', authenticate, requireRole('admin'), reservaController.getAll);
router.get('/mis-reservas', authenticate, reservaController.getMias);
router.post('/', authenticate, reservaController.create);
router.delete('/:id', authenticate, reservaController.remove);
// Cambiamos de PATCH a POST para evitar preflight complejo
router.post('/:id/estado', authenticate, requireRole('admin'), reservaController.updateEstado);

export default router;