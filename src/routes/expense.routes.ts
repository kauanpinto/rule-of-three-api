import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware.js';
import { expenseController } from '@/controllers/expense.controller.js';

const expenseRoutes = Router();

expenseRoutes.post('/', requireAuth, expenseController.createExpense);

export default expenseRoutes;
