import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from '@/routes/auth.routes.js';
import expenseRoutes from '@/routes/expense.routes.js';
import dashboardRoutes from '@/routes/dashboard.routes.js';
import type { Application, Request, Response } from 'express';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

export default app;
