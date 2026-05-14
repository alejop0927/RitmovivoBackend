import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { authenticate, AuthRequest } from '../middleware/auth';
import { mapUser } from '../lib/mappers';

const router = Router();

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

router.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });

  const { nombre, apellido, email, password, telefono } = parsed.data;

  const { data: existing } = await supabase.from('usuarios').select('id').eq('email', email).single();
  if (existing) return res.status(409).json({ message: 'Email ya registrado' });

  const passwordHash = await bcrypt.hash(password, 10);
  const { data: user, error } = await supabase
    .from('usuarios')
    .insert({ nombre, apellido, email, password_hash: passwordHash, telefono, rol: 'estudiante' })
    .select()
    .single();

  if (error || !user) return res.status(500).json({ message: 'Error al crear usuario' });

  const u = user as Record<string, unknown>;
  res.status(201).json({ token: signToken(u as { id: string; rol: string }), user: mapUser(u) });
});

router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message });

  const { email, password } = parsed.data;
  const { data: user } = await supabase.from('usuarios').select('*').eq('email', email).single();

  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

  const u = user as Record<string, unknown>;
  const valid = await bcrypt.compare(password, u['password_hash'] as string);
  if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

  res.json({ token: signToken(u as { id: string; rol: string }), user: mapUser(u) });
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const { data: user } = await supabase.from('usuarios').select('*').eq('id', req.user!.id).single();
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(mapUser(user as Record<string, unknown>));
});

export default router;
