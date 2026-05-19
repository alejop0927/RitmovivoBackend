import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import * as inscripcionService from '../services/inscripcion.service';

// ==================== ESTUDIANTE ====================
export const solicitar = async (req: AuthRequest, res: Response) => {
  const parsed = z.object({ horarioId: z.string().uuid() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });
  try {
    const result = await inscripcionService.solicitarInscripcion(req.user!.id, parsed.data.horarioId);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(409).json({ message: e.message });
  }
};

export const getMisActivas = async (req: AuthRequest, res: Response) => {
  try {
    const activas = await inscripcionService.getMisInscripcionesActivas(req.user!.id);
    res.json(activas);
  } catch {
    res.status(500).json({ message: 'Error al obtener inscripciones activas' });
  }
};

export const getMisPendientes = async (req: AuthRequest, res: Response) => {
  try {
    const pendientes = await inscripcionService.getMisSolicitudesPendientes(req.user!.id);
    res.json(pendientes);
  } catch {
    res.status(500).json({ message: 'Error al obtener solicitudes pendientes' });
  }
};

export const cancelarActiva = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);  // ✅ CORREGIDO
    await inscripcionService.cancelarInscripcionActiva(id, req.user!.id);
    res.status(204).send();
  } catch (e: any) {
    res.status(404).json({ message: e.message });
  }
};

// ==================== ADMIN ====================
export const getPendientes = async (_req: AuthRequest, res: Response) => {
  try {
    const pendientes = await inscripcionService.getSolicitudesPendientes();
    res.json(pendientes);
  } catch {
    res.status(500).json({ message: 'Error al obtener solicitudes pendientes' });
  }
};

export const aprobar = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);  // ✅ CORREGIDO
    const result = await inscripcionService.aprobarInscripcion(id);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const rechazar = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);  // ✅ CORREGIDO
    const result = await inscripcionService.rechazarInscripcion(id);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

// ==================== INSTRUCTOR ====================
export const getMisInscripcionesInstructor = async (req: AuthRequest, res: Response) => {
  try {
    const inscripciones = await inscripcionService.getInscripcionesByInstructor(req.user!.id);
    res.json(inscripciones);
  } catch {
    res.status(500).json({ message: 'Error al obtener inscripciones' });
  }
};

// ==================== ADMIN (todas) ====================
export const getAll = async (_req: AuthRequest, res: Response) => {
  try {
    const todas = await inscripcionService.getAllInscripciones();
    res.json(todas);
  } catch {
    res.status(500).json({ message: 'Error al obtener todas las inscripciones' });
  }
};