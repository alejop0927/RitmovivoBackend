import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import clasesRoutes from './routes/clases';
import instructoresRoutes from './routes/instructores';
import horariosRoutes from './routes/horarios';
import inscripcionesRoutes from './routes/inscripciones';
import usuariosRoutes from './routes/usuarios';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] ?? 3001;

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clases', clasesRoutes);
app.use('/api/instructores', instructoresRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.listen(PORT, () => {
  console.log(`RitmoVivo API corriendo en http://localhost:${PORT}/api`);
});
