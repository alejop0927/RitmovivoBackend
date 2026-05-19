import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import * as feedbackService from '../services/feedback.service';

const feedbackSchema = z.object({
  claseId: z.string().uuid(),
  puntuacion: z.number().int().min(1).max(5),
  comentario: z.string().optional(),
});

export const getFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const data = await feedbackService.getFeedbackByClaseId(req.params['claseId'] as string);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener feedback' });
  }
};

export const postFeedback = async (req: AuthRequest, res: Response) => {
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });

  try {
    const data = await feedbackService.createFeedbackEntry({
      usuarioId: req.user!.id,
      claseId: parsed.data.claseId,
      puntuacion: parsed.data.puntuacion,
      comentario: parsed.data.comentario,
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(409).json({ message: 'Error al enviar feedback' });
  }
};

export const deleteFeedback = async (req: AuthRequest, res: Response) => {
  try {
    await feedbackService.deleteFeedbackEntry(
      req.params['id'] as string,
      req.user!.id
    );
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: 'Feedback no encontrado' });
  }
};