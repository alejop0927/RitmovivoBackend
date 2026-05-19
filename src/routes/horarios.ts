import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import * as horarioController from '../controllers/horario.controller';

const router = Router();

router.get('/', horarioController.getAll);
router.get('/:id', horarioController.getById);
router.post('/', authenticate, requireRole('admin'), horarioController.create);
router.put('/:id', authenticate, requireRole('admin'), horarioController.update);
router.delete('/:id', authenticate, requireRole('admin'), horarioController.remove);

export default router;