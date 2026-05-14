import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { authenticate, AuthRequest } from '../middleware/auth';
import { mapInscripcion } from '../lib/mappers';

const router = Router();

const INSCRIPCION_SELECT = '*, usuarios(*), horarios(*, clases(*, instructores(*)), instructores(*))';

router.get('/mis-inscripciones', authenticate, async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabase
    .from('inscripciones')
    .select(INSCRIPCION_SELECT)
    .eq('usuario_id', req.user!.id);
  if (error) return res.status(500).json({ message: error.message });
  res.json((data as Record<string, unknown>[]).map(mapInscripcion));
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const parsed = z.object({ horarioId: z.string().uuid() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });

  const { data, error } = await supabase
    .from('inscripciones')
    .insert({ usuario_id: req.user!.id, horario_id: parsed.data.horarioId, estado: 'activa' })
    .select(INSCRIPCION_SELECT)
    .single();

  if (error) return res.status(409).json({ message: error.message });
  res.status(201).json(mapInscripcion(data as Record<string, unknown>));
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { error } = await supabase
    .from('inscripciones')
    .delete()
    .eq('id', req.params['id'])
    .eq('usuario_id', req.user!.id);

  if (error) return res.status(404).json({ message: 'Inscripción no encontrada' });
  res.status(204).send();
});

export default router;
