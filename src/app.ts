import '@/config/env.js';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';
import { corsConfig } from '@/config/cors.js';
import authRoutes from '@/routes/auth.routes.js';
import userRoutes from '@/routes/user.routes.js';
import expenseRoutes from '@/routes/expense.routes.js';
import dashboardRoutes from '@/routes/dashboard.routes.js';
import type { Application, Request, Response } from 'express';

const app: Application = express();

app.use(express.json());
app.use(corsConfig);
app.use(helmet());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/dashboard', dashboardRoutes);

app.set('trust proxy', true);

app.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

export default app;
