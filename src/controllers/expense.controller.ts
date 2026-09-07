import { ZodError } from 'zod';
import { expenseSchema } from '@/schemas/expense.schema.js';
import { expenseService } from '@/services/expense.service.js';
import type { Request, Response } from 'express';

async function createExpense(req: Request, res: Response) {
  try {
    const validatedData = expenseSchema.createExpenseSchema.parse(req.body);
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Não autenticado' });
      return;
    }

    const newExpense = await expenseService.createExpense(userId, validatedData);

    res.status(201).json(newExpense);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Erro de validação', issues: error.issues });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

async function getAllExpenses(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Não autenticado' });
      return;
    }

    const listExpenses = await expenseService.getAllExpenses(userId);

    res.status(200).json(listExpenses);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
}

async function updateExpense(req: Request, res: Response) {
  try {
    const validatedData = expenseSchema.updateExpenseSchema.parse(req.body);
    const userId = req.userId;
    const id = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'Não autenticado' });
      return;
    }

    if (!id || Array.isArray(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const updatedExpense = await expenseService.updateExpense(id, userId, validatedData);

    if (!updatedExpense) {
      res.status(404).json({ message: 'Gasto não encontrado' });
      return;
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Erro de validação', issues: error.issues });
    } else {
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

async function deleteExpense(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const id = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'Não autenticado' });
      return;
    }

    if (!id || Array.isArray(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const deletedExpense = await expenseService.deleteExpense(id, userId);

    if (!deletedExpense) {
      res.status(404).json({ message: 'Gasto não encontrado' });
      return;
    }

    res.status(200).json({ message: 'Gasto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
}

export const expenseController = {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
};
