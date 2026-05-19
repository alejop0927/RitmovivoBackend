import { prisma } from '../lib/prisma';

export const getAllUsuarios = async () => {
  return await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      rol: true,
      telefono: true,
      created_at: true,
    },
  });
};

export const updateUsuario = async (id: string, data: {
  nombre?: string;
  apellido?: string;
  telefono?: string;
}) => {
  return await prisma.usuario.update({ where: { id }, data });
};