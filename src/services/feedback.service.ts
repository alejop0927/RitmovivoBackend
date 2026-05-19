import { prisma } from '../lib/prisma';

export const getFeedbackByClaseId = async (claseId: string) => {
  return await prisma.feedback.findMany({
    where: { clase_id: claseId },
    include: { usuario: true },
  });
};

export const createFeedbackEntry = async (data: {
  usuarioId: string;
  claseId: string;
  puntuacion: number;
  comentario?: string;
}) => {
  return await prisma.feedback.create({
    data: {
      usuario_id: data.usuarioId,
      clase_id: data.claseId,
      puntuacion: data.puntuacion,
      comentario: data.comentario,
    },
    include: { usuario: true, clase: true },
  });
};

export const deleteFeedbackEntry = async (id: string, usuarioId: string) => {
  return await prisma.feedback.delete({
    where: { id, usuario_id: usuarioId },
  });
};