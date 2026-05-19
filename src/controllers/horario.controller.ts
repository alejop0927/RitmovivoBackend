import { Request, Response } from 'express';
import * as horarioService from '../services/horario.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const data = await horarioService.getAllHorarios(
      req.query['claseId'] as string | undefined,
      req.query['fecha'] as string | undefined,
    );
    res.json(data);
  } catch {
    res.status(500).json({ message: 'Error al obtener horarios' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const data = await horarioService.getHorarioById(String(req.params['id']));
    if (!data) return res.status(404).json({ message: 'Horario no encontrado' });
    res.json(data);
  } catch {
    res.status(500).json({ message: 'Error al obtener horario' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const data = await horarioService.createHorario(req.body);
    res.status(201).json(data);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const data = await horarioService.updateHorario(String(req.params['id']), req.body);
    res.json(data);
  } catch {
    res.status(404).json({ message: 'Horario no encontrado' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await horarioService.deleteHorario(String(req.params['id']));
    res.status(204).send();
  } catch {
    res.status(404).json({ message: 'Horario no encontrado' });
  }
};