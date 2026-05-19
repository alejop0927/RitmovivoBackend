import { prisma } from '../lib/prisma';

const INCLUDE = {
  clase: { include: { instructor: true } },
  instructor: true,
} as const;

export const getAllHorarios = async (claseId?: string, fecha?: string) => {
  const where: any = {};
  if (claseId) where.clase_id = claseId;
  if (fecha) where.fecha = new Date(fecha);
  return await prisma.horario.findMany({ where, include: INCLUDE });
};

export const getHorarioById = async (id: string) => {
  return await prisma.horario.findUnique({ where: { id }, include: INCLUDE });
};

export const createHorario = async (data: {
  clase_id: string;
  instructor_id?: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  salon: string;
  disponible?: boolean;
}) => {
  return await prisma.horario.create({
    data: {
      ...data,
      fecha: new Date(data.fecha),
      disponible: data.disponible ?? true,
    },
    include: INCLUDE,
  });
};

export const updateHorario = async (id: string, data: any) => {
  if (data.fecha) data.fecha = new Date(data.fecha);
  return await prisma.horario.update({ where: { id }, data, include: INCLUDE });
};

export const deleteHorario = async (id: string) => {
  await prisma.inscripcion.deleteMany({ where: { horario_id: id } });
  await prisma.reserva.deleteMany({ where: { horario_id: id } });
  return await prisma.horario.delete({ where: { id } });
};