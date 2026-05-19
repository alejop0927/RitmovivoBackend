import { prisma } from '../lib/prisma';

export const getAllInstructores = async () => {
  return await prisma.instructor.findMany({ include: { usuario: true } });
};

export const getInstructorById = async (id: string) => {
  return await prisma.instructor.findUnique({ where: { id }, include: { usuario: true } });
};

export const getInstructorByUsuarioId = async (usuarioId: string) => {
  return await prisma.instructor.findUnique({ where: { usuario_id: usuarioId }, include: { usuario: true } });
};

export const createInstructor = async (data: {
  usuario_id?: string;
  nombre: string;
  apellido: string;
  especialidad: string[];
  bio?: string;
  experiencia?: number;
  rating?: number;
}) => {
  return await prisma.instructor.create({ data, include: { usuario: true } });
};

export const updateInstructor = async (id: string, data: any) => {
  return await prisma.instructor.update({ where: { id }, data, include: { usuario: true } });
};

export const deleteInstructor = async (id: string) => {
  await prisma.horario.updateMany({ where: { instructor_id: id }, data: { instructor_id: null } });
  await prisma.clase.updateMany({ where: { instructor_id: id }, data: { instructor_id: null } });
  return await prisma.instructor.delete({ where: { id } });
};