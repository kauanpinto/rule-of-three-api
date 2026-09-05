import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware.js';
import { expenseController } from '@/controllers/expense.controller.js';

const expenseRoutes = Router();

expenseRoutes.post('/', requireAuth, expenseController.createExpense);
expenseRoutes.get('/', requireAuth, expenseController.getAllExpenses);
expenseRoutes.patch('/:id', requireAuth, expenseController.updateExpense);
expenseRoutes.delete('/:id', requireAuth, expenseController.deleteExpense);

export default expenseRoutes;
