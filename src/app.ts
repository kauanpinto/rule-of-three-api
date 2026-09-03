import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import type { Application, Request, Response } from 'express';
import authRoutes from '@/routes/auth.routes';
import expenseRoutes from '@/routes/expense.routes';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);

app.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

export default app;
