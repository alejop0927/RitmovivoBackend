// src/services/inscripcion.service.ts
import { prisma } from '../lib/prisma';

const INCLUDE = {
  usuario: true,
  horario: {
    include: {
      clase: { include: { instructor: true } },
      instructor: true,
    },
  },
} as const;

// ==================== ESTUDIANTE ====================

// Solicitar inscripción (estado pendiente)
export const solicitarInscripcion = async (usuarioId: string, horarioId: string) => {
  const horario = await prisma.horario.findUnique({
    where: { id: horarioId },
    include: { clase: true },
  });
  if (!horario) throw new Error('Horario no encontrado');
  if (!horario.disponible) throw new Error('Horario no disponible');

  const existing = await prisma.inscripcion.findFirst({
    where: { usuario_id: usuarioId, horario_id: horarioId },
  });
  if (existing) {
    if (existing.estado === 'pendiente') throw new Error('Ya tienes una solicitud pendiente para este horario');
    if (existing.estado === 'activa') throw new Error('Ya estás inscrito en este horario');
    throw new Error('Ya has solicitado o estado en este horario');
  }

  return await prisma.inscripcion.create({
    data: {
      usuario_id: usuarioId,
      horario_id: horarioId,
      estado: 'pendiente',
    },
    include: INCLUDE,
  });
};

// Obtener mis inscripciones activas (matriculado)
export const getMisInscripcionesActivas = async (usuarioId: string) => {
  return await prisma.inscripcion.findMany({
    where: { usuario_id: usuarioId, estado: 'activa' },
    include: INCLUDE,
  });
};

// Obtener mis solicitudes pendientes
export const getMisSolicitudesPendientes = async (usuarioId: string) => {
  return await prisma.inscripcion.findMany({
    where: { usuario_id: usuarioId, estado: 'pendiente' },
    include: INCLUDE,
  });
};

// Cancelar inscripción activa (decrementa contador)
export const cancelarInscripcionActiva = async (id: string, usuarioId: string) => {
  const inscripcion = await prisma.inscripcion.findFirst({
    where: { id, usuario_id: usuarioId, estado: 'activa' },
    include: { horario: { include: { clase: true } } },
  });
  if (!inscripcion) throw new Error('Inscripción activa no encontrada');

  return await prisma.$transaction(async (tx) => {
    await tx.inscripcion.update({
      where: { id },
      data: { estado: 'cancelada' },
    });
    await tx.clase.update({
      where: { id: inscripcion.horario.clase_id },
      data: { inscritos: { decrement: 1 } },
    });
  });
};

// ==================== ADMIN ====================

// Obtener todas las solicitudes pendientes
export const getSolicitudesPendientes = async () => {
  return await prisma.inscripcion.findMany({
    where: { estado: 'pendiente' },
    include: INCLUDE,
  });
};

// Aprobar solicitud (estado activa + incrementar contador)
export const aprobarInscripcion = async (inscripcionId: string) => {
  const inscripcion = await prisma.inscripcion.findUnique({
    where: { id: inscripcionId },
    include: { horario: { include: { clase: true } } },
  });
  if (!inscripcion) throw new Error('Inscripción no encontrada');
  if (inscripcion.estado !== 'pendiente') throw new Error('Solo se pueden aprobar solicitudes pendientes');

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.inscripcion.update({
      where: { id: inscripcionId },
      data: { estado: 'activa' },
      include: INCLUDE,
    });
    await tx.clase.update({
      where: { id: inscripcion.horario.clase_id },
      data: { inscritos: { increment: 1 } },
    });
    return updated;
  });
};

// Rechazar solicitud (estado cancelada, no afecta contador)
export const rechazarInscripcion = async (inscripcionId: string) => {
  const inscripcion = await prisma.inscripcion.findUnique({
    where: { id: inscripcionId },
  });
  if (!inscripcion) throw new Error('Inscripción no encontrada');
  if (inscripcion.estado !== 'pendiente') throw new Error('Solo se pueden rechazar solicitudes pendientes');

  return await prisma.inscripcion.update({
    where: { id: inscripcionId },
    data: { estado: 'cancelada' },
    include: INCLUDE,
  });
};

// ==================== INSTRUCTOR ====================

// Obtener inscripciones activas de las clases que imparte
export const getInscripcionesByInstructor = async (usuarioId: string) => {
  const instructor = await prisma.instructor.findUnique({
    where: { usuario_id: usuarioId },
  });
  if (!instructor) return [];

  return await prisma.inscripcion.findMany({
    where: {
      estado: 'activa',
      OR: [
        { horario: { instructor_id: instructor.id } },
        { horario: { clase: { instructor_id: instructor.id } } },
      ],
    },
    include: INCLUDE,
  });
};

// ==================== ADMIN (todas las inscripciones) ====================
export const getAllInscripciones = async () => {
  return await prisma.inscripcion.findMany({ include: INCLUDE });
};