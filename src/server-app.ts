import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import attendanceRoutes from './routes/attendance.routes';
import patientRoutes from './routes/patient.routes';
import prescriptionRoutes from './routes/prescription.routes';
import certificateRoutes from './routes/certificate.routes';

const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

// Rotas
app.use('/api/attendances', attendanceRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/certificates', certificateRoutes);

// Middleware de erro
app.use(errorMiddleware);

export { app }; 