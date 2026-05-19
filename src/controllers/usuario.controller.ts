import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import * as usuarioService from '../services/usuario.service';

const updateSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  telefono: z.string().optional(),
});

export const getAll = async (_req: AuthRequest, res: Response) => {
  try {
    res.json(await usuarioService.getAllUsuarios());
  } catch {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  if (req.user!.id !== String(req.params['id']) && req.user!.rol !== 'admin') {
    return res.status(403).json({ message: 'No autorizado' });
  }
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });
  try {
    const user = await usuarioService.updateUsuario(String(req.params['id']), parsed.data);
    res.json({ id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, rol: user.rol, telefono: user.telefono, createdAt: user.created_at });
  } catch {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
};