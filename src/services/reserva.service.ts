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

// Obtener reservas del usuario autenticado
export const getMisReservas = async (usuarioId: string) => {
  return await prisma.reserva.findMany({
    where: { usuario_id: usuarioId },
    include: INCLUDE,
    orderBy: { created_at: 'desc' },
  });
};

// Obtener todas las reservas (admin)
export const getAllReservas = async () => {
  return await prisma.reserva.findMany({
    include: INCLUDE,
    orderBy: { created_at: 'desc' },
  });
};

// Crear una reserva (libre o con horario de clase)
export const createReserva = async (
  usuarioId: string,
  data: {
    horarioId?: string;
    salon?: string;
    fecha?: string;
    hora_inicio?: string;
    hora_fin?: string;
    numero_personas: number;
    con_profesor: boolean;
  }
) => {
  // Caso 1: Reserva vinculada a horario de clase
  if (data.horarioId) {
    const horario = await prisma.horario.findUnique({ where: { id: data.horarioId } });
    if (!horario) throw new Error('Horario no encontrado');
    if (!horario.disponible) throw new Error('Horario no disponible');

    const existing = await prisma.reserva.findFirst({
      where: {
        usuario_id: usuarioId,
        horario_id: data.horarioId,
        estado: { in: ['pendiente', 'confirmada'] },
      },
    });
    if (existing) throw new Error('Ya tienes una reserva activa en este horario');

    return await prisma.reserva.create({
      data: {
        usuario_id: usuarioId,
        horario_id: data.horarioId,
        numero_personas: data.numero_personas,
        con_profesor: data.con_profesor,
        estado: 'pendiente',
      },
      include: INCLUDE,
    });
  }

  // Caso 2: Reserva libre (sin horario de clase)
  if (!data.salon || !data.fecha || !data.hora_inicio || !data.hora_fin) {
    throw new Error('Debe proporcionar salón, fecha, hora inicio y hora fin');
  }
  if (data.hora_inicio >= data.hora_fin) {
    throw new Error('La hora de inicio debe ser anterior a la hora de fin');
  }

  // Normalizar fechas para comparación (solo día, sin zona horaria)
  const fechaObj = new Date(data.fecha);
  const hoy = new Date();
  hoy.setUTCHours(0, 0, 0, 0);
  fechaObj.setUTCHours(0, 0, 0, 0);
  if (isNaN(fechaObj.getTime())) throw new Error('Fecha inválida');
  if (fechaObj < hoy) throw new Error('No se puede reservar en fecha pasada');

  // Verificar duplicados
  const existing = await prisma.reserva.findFirst({
    where: {
      usuario_id: usuarioId,
      salon: data.salon,
      fecha: fechaObj,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
      estado: { in: ['pendiente', 'confirmada'] },
    },
  });
  if (existing) throw new Error('Ya tienes una reserva activa para este espacio y horario');

  return await prisma.reserva.create({
    data: {
      usuario_id: usuarioId,
      salon: data.salon,
      fecha: fechaObj,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
      numero_personas: data.numero_personas,
      con_profesor: data.con_profesor,
      estado: 'pendiente',
    },
    include: INCLUDE,
  });
};

// Cancelar reserva (dueño o admin)
export const cancelarReserva = async (id: string, usuarioId: string, esAdmin: boolean = false) => {
  const where: any = { id };
  if (!esAdmin) where.usuario_id = usuarioId;
  return await prisma.reserva.delete({ where });
};

// Actualizar estado de una reserva (admin)
export const actualizarEstadoReserva = async (id: string, estado: string) => {
  return await prisma.reserva.update({
    where: { id },
    data: { estado },
    include: INCLUDE,
  });
};