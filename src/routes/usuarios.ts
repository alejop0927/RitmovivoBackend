import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import * as usuarioController from '../controllers/usuario.controller';

const router = Router();

// Solo admin ve todos los usuarios
router.get('/', authenticate, requireRole('admin'), usuarioController.getAll);
// Cada usuario puede editar su propio perfil, admin puede editar cualquiera
router.put('/:id', authenticate, usuarioController.update);

export default router;