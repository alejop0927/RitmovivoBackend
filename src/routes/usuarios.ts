import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const updateSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  telefono: z.string().optional(),
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user!.id !== req.params['id'] && req.user!.rol !== 'admin') {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });

  const { data, error } = await supabase
    .from('usuarios')
    .update(parsed.data)
    .eq('id', req.params['id'])
    .select('id, nombre, apellido, email, rol, telefono, created_at')
    .single();

  if (error || !data) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(data);
});

export default router;
