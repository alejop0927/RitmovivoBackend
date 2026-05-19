import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

const registerSchema = z.object({
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  telefono: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signToken(user: { id: string; rol: string }) {
  return jwt.sign({ id: user.id, rol: user.rol }, process.env['JWT_SECRET']!, { expiresIn: '7d' });
}

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });

  const { nombre, apellido, email, password, telefono } = parsed.data;

  try {
    const existing = await authService.findUserByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email ya registrado' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await authService.createUser({ nombre, apellido, email, password_hash, telefono });

    res.status(201).json({
      token: signToken(user),
      user: { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, rol: user.rol, telefono: user.telefono, createdAt: user.created_at },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });

  try {
    const user = await authService.findUserByEmail(parsed.data.email);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(parsed.data.password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

    res.json({
      token: signToken(user),
      user: { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, rol: user.rol, telefono: user.telefono, createdAt: user.created_at },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al login' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.findUserById(req.user!.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      telefono: user.telefono,
      createdAt: user.created_at
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};