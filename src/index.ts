import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/auth';
import clasesRoutes from './routes/clases';
import instructoresRoutes from './routes/instructores';
import horariosRoutes from './routes/horarios';
import inscripcionesRoutes from './routes/inscripciones';
import usuariosRoutes from './routes/usuarios';
import reservasRoutes from './routes/reservas';
import feedbackRoutes from './routes/feedback';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS amplio
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Manejador OPTIONS global (esto evita errores de path-to-regexp)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204);
  } else {
    next();
  }
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/clases', clasesRoutes);
app.use('/api/instructores', instructoresRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/feedback', feedbackRoutes);

// Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  },
  transports: ['polling', 'websocket'],
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No autorizado'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (socket as any).userId = decoded.id;
    (socket as any).userRol = decoded.rol;
    next();
  } catch {
    next(new Error('Token inválido'));
  }
});

io.on('connection', async (socket) => {
  const userId = (socket as any).userId;
  const userRol = (socket as any).userRol;
  console.log(`🔌 Conectado: ${userId} (${userRol})`);

  socket.on('join-clase', (claseId) => {
    console.log(`📌 Usuario ${userId} se unió a clase ${claseId}`);
    (socket as any).claseId = claseId;
  });

  socket.on('send-message', async ({ claseId, message }) => {
    const { prisma } = await import('./lib/prisma');
    const user = await prisma.usuario.findUnique({ where: { id: userId } });
    const nombre = user?.nombre || 'Usuario';
    const apellido = user?.apellido || '';
    const msgData = {
      userId,
      nombre,
      apellido,
      message,
      timestamp: new Date().toISOString(),
      claseId,
    };
    io.emit('new-message', msgData);
    console.log(`💬 ${nombre}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Desconectado: ${userId}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.IO listo (broadcast mode)`);
});