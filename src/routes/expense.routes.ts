import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware.js';
import { createExpense } from '@/controllers/expense.controller.js';

const expenseRoutes = Router();

expenseRoutes.post('/', requireAuth, createExpense);

export default expenseRoutes;
