import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { authenticate, requireRole } from '../middleware/auth';
import { mapClase } from '../lib/mappers';

const router = Router();

const CLASE_SELECT = '*, instructores(*)';

const claseSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  nivel: z.enum(['principiante', 'intermedio', 'avanzado']),
  instructor_id: z.string().uuid().optional(),
  duracion: z.number().int().positive(),
  capacidad: z.number().int().positive(),
  estilo: z.string().min(1),
});

router.get('/', async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from('clases').select(CLASE_SELECT);
  if (error) return res.status(500).json({ message: error.message });
  res.json((data as Record<string, unknown>[]).map(mapClase));
});

router.get('/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('clases').select(CLASE_SELECT).eq('id', req.params['id']).single();
  if (error || !data) return res.status(404).json({ message: 'Clase no encontrada' });
  res.json(mapClase(data as Record<string, unknown>));
});

router.post('/', authenticate, requireRole('admin'), async (req: Request, res: Response) => {
  const parsed = claseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });

  const { data, error } = await supabase.from('clases').insert(parsed.data).select(CLASE_SELECT).single();
  if (error || !data) return res.status(500).json({ message: 'Error al crear clase' });
  res.status(201).json(mapClase(data as Record<string, unknown>));
});

router.put('/:id', authenticate, requireRole('admin'), async (req: Request, res: Response) => {
  const parsed = claseSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });

  const { data, error } = await supabase.from('clases').update(parsed.data).eq('id', req.params['id']).select(CLASE_SELECT).single();
  if (error || !data) return res.status(404).json({ message: 'Clase no encontrada' });
  res.json(mapClase(data as Record<string, unknown>));
});

router.delete('/:id', authenticate, requireRole('admin'), async (req: Request, res: Response) => {
  const { error } = await supabase.from('clases').delete().eq('id', req.params['id']);
  if (error) return res.status(404).json({ message: 'Clase no encontrada' });
  res.status(204).send();
});

export default router;
