import { ZodError } from 'zod';
import { expenseSchema } from '@/schemas/expense.schema.js';
import { expenseService } from '@/services/expense.service.js';
import type { Request, Response } from 'express';

async function createExpense(req: Request, res: Response) {
  try {
    const validatedData = expenseSchema.createExpenseSchema.parse(req.body);
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Não autenticado' });
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
      return res.status(401).json({ message: 'Não autenticado' });
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
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const updatedExpense = await expenseService.updateExpense(id, userId, validatedData);

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Gasto não encontrado' });
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
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const deletedExpense = await expenseService.deleteExpense(id, userId);

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Gasto não encontrado' });
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
