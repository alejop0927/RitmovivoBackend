import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { mapHorario } from '../lib/mappers';

const router = Router();

const HORARIO_SELECT = '*, clases(*, instructores(*)), instructores(*)';

router.get('/', async (req: Request, res: Response) => {
  let query = supabase.from('horarios').select(HORARIO_SELECT);

  if (req.query['claseId']) query = query.eq('clase_id', req.query['claseId'] as string);
  if (req.query['fecha']) query = query.eq('fecha', req.query['fecha'] as string);

  const { data, error } = await query;
  if (error) return res.status(500).json({ message: error.message });
  res.json((data as Record<string, unknown>[]).map(mapHorario));
});

export default router;
