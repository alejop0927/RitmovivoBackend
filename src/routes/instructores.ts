import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { mapInstructor } from '../lib/mappers';

const router = Router();

const INSTRUCTOR_SELECT = 'id, nombre, apellido, especialidad, bio, experiencia, rating';

router.get('/', async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from('instructores').select(INSTRUCTOR_SELECT);
  if (error) return res.status(500).json({ message: error.message });
  res.json((data as Record<string, unknown>[]).map(mapInstructor));
});

router.get('/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('instructores')
    .select(INSTRUCTOR_SELECT)
    .eq('id', req.params['id'])
    .single();
  if (error || !data) return res.status(404).json({ message: 'Instructor no encontrado' });
  res.json(mapInstructor(data as Record<string, unknown>));
});

export default router;
