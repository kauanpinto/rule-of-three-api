import { ZodError } from 'zod';
import { expenseSchema } from '@/schemas/expense.schema.js';
import { expenseService } from '@/services/expense.service.js';
import type { Request, Response } from 'express';

async function createExpense(req: Request, res: Response) {
  try {
    const validatedData = expenseSchema.createExpenseSchema.parse(req.body);
    const userId = (req as any).userId;

    const newExpense = await expenseService.createExpense(userId, validatedData);

    res.status(201).json(newExpense);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Erro de validação', issues: error.issues });
    } else {
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

export const expenseController = {
  createExpense,
};
