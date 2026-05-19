import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import * as reservaService from '../services/reserva.service';

export const getMias = async (req: AuthRequest, res: Response) => {
  try {
    const reservas = await reservaService.getMisReservas(req.user!.id);
    res.json(reservas);
  } catch {
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
};

export const getAll = async (_req: AuthRequest, res: Response) => {
  try {
    const reservas = await reservaService.getAllReservas();
    res.json(reservas);
  } catch {
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  const schema = z
    .object({
      horarioId: z.string().uuid().optional(),
      salon: z.string().optional(),
      fecha: z.string().optional(),
      hora_inicio: z.string().optional(),
      hora_fin: z.string().optional(),
      numero_personas: z.number().int().min(1).default(1),
      con_profesor: z.boolean().default(false),
    })
    .refine(
      (data) => data.horarioId || (data.salon && data.fecha && data.hora_inicio && data.hora_fin),
      {
        message: 'Debe proporcionar horarioId o (salon, fecha, hora_inicio, hora_fin)',
      }
    );

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0]?.message });
  }

  try {
    const reserva = await reservaService.createReserva(req.user!.id, parsed.data);
    res.status(201).json(reserva);
  } catch (e: any) {
    res.status(409).json({ message: e.message });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const esAdmin = req.user!.rol === 'admin';
    await reservaService.cancelarReserva(id, req.user!.id, esAdmin);
    res.status(204).send();
  } catch {
    res.status(404).json({ message: 'Reserva no encontrada o no autorizada' });
  }
};

export const updateEstado = async (req: AuthRequest, res: Response) => {
  const { estado } = req.body;
  if (!['pendiente', 'confirmada', 'cancelada'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }
  try {
    const id = String(req.params.id);
    const reserva = await reservaService.actualizarEstadoReserva(id, estado);
    res.json(reserva);
  } catch {
    res.status(404).json({ message: 'Reserva no encontrada' });
  }
};