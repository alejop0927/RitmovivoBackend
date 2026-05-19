import { prisma } from '../lib/prisma';

const INCLUDE = { instructor: true } as const;

export const getAllClases = async () => {
  return await prisma.clase.findMany({ include: INCLUDE });
};

export const getClaseById = async (id: string) => {
  return await prisma.clase.findUnique({ where: { id }, include: INCLUDE });
};

export const createClase = async (data: any) => {
  return await prisma.clase.create({ data, include: INCLUDE });
};

export const updateClase = async (id: string, data: any) => {
  return await prisma.clase.update({ where: { id }, data, include: INCLUDE });
};

export const deleteClase = async (id: string) => {
  await prisma.feedback.deleteMany({ where: { clase_id: id } });
  await prisma.inscripcion.deleteMany({ where: { horario: { clase_id: id } } });
  await prisma.reserva.deleteMany({ where: { horario: { clase_id: id } } });
  await prisma.horario.deleteMany({ where: { clase_id: id } });
  return await prisma.clase.delete({ where: { id } });
};