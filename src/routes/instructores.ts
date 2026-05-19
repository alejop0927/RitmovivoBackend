import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import * as instructorController from '../controllers/instructor.controller';

const router = Router();

router.get('/', instructorController.getAll);
router.get('/mi-perfil', authenticate, instructorController.getMiPerfil);
router.get('/:id', instructorController.getById);
router.post('/', authenticate, requireRole('admin'), instructorController.create);
router.put('/:id', authenticate, requireRole('admin'), instructorController.update);
router.delete('/:id', authenticate, requireRole('admin'), instructorController.remove);

export default router;