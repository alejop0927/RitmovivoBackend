import { Request, Response } from 'express';
import * as instructorService from '../services/instructor.service';
import { AuthRequest } from '../middleware/auth';

export const getAll = async (_req: Request, res: Response) => {
  try {
    res.json(await instructorService.getAllInstructores());
  } catch {
    res.status(500).json({ message: 'Error al obtener instructores' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const data = await instructorService.getInstructorById(String(req.params['id']));
    if (!data) return res.status(404).json({ message: 'Instructor no encontrado' });
    res.json(data);
  } catch {
    res.status(500).json({ message: 'Error al obtener instructor' });
  }
};

export const getMiPerfil = async (req: AuthRequest, res: Response) => {
  try {
    const data = await instructorService.getInstructorByUsuarioId(req.user!.id);
    if (!data) return res.status(404).json({ message: 'Perfil de instructor no encontrado' });
    res.json(data);
  } catch {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await instructorService.createInstructor(req.body));
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    res.json(await instructorService.updateInstructor(String(req.params['id']), req.body));
  } catch {
    res.status(404).json({ message: 'Instructor no encontrado' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await instructorService.deleteInstructor(String(req.params['id']));
    res.status(204).send();
  } catch {
    res.status(404).json({ message: 'Instructor no encontrado' });
  }
};