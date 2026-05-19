import { prisma } from '../lib/prisma';

export const findUserByEmail = async (email: string) => {
  return await prisma.usuario.findUnique({ where: { email } });
};

export const findUserById = async (id: string) => {
  return await prisma.usuario.findUnique({ where: { id } });
};

export const createUser = async (data: {
  nombre: string;
  apellido: string;
  email: string;
  password_hash: string;
  telefono?: string;
}) => {
  return await prisma.usuario.create({
    data: {
      ...data,
      rol: 'estudiante',
    },
  });
};