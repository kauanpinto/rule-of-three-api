import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware';
import { createExpense } from '@/controllers/expense.controller';

const expenseRoutes = Router();

expenseRoutes.post('/', requireAuth, createExpense);

export default expenseRoutes;
