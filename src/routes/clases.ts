import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import * as claseController from '../controllers/clase.controller';

const router = Router();

router.get('/', claseController.getAll);
router.get('/:id', claseController.getById);
router.post('/', authenticate, requireRole('admin'), claseController.create);
router.put('/:id', authenticate, requireRole('admin'), claseController.update);
router.delete('/:id', authenticate, requireRole('admin'), claseController.remove);

export default router;