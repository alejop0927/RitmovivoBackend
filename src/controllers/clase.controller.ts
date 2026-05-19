import { Request, Response } from 'express';
import { z } from 'zod';
import * as claseService from '../services/clase.service';

const claseSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  nivel: z.enum(['principiante', 'intermedio', 'avanzado']),
  instructor_id: z.string().uuid().optional(),
  duracion: z.number().int().positive(),
  capacidad: z.number().int().positive(),
  estilo: z.string().min(1),
});

export const getAll = async (_req: Request, res: Response) => {
  try {
    res.json(await claseService.getAllClases());
  } catch {
    res.status(500).json({ message: 'Error al obtener clases' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const data = await claseService.getClaseById(String(req.params['id']));
    if (!data) return res.status(404).json({ message: 'Clase no encontrada' });
    res.json(data);
  } catch {
    res.status(500).json({ message: 'Error al obtener clase' });
  }
};

export const create = async (req: Request, res: Response) => {
  const parsed = claseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });
  try {
    res.status(201).json(await claseService.createClase(parsed.data));
  } catch {
    res.status(500).json({ message: 'Error al crear clase' });
  }
};

export const update = async (req: Request, res: Response) => {
  const parsed = claseSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });
  try {
    res.json(await claseService.updateClase(String(req.params['id']), parsed.data));
  } catch {
    res.status(404).json({ message: 'Clase no encontrada' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await claseService.deleteClase(String(req.params['id']));
    res.status(204).send();
  } catch {
    res.status(404).json({ message: 'Clase no encontrada' });
  }
};