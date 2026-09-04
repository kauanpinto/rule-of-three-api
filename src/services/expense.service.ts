import { expenseRepository } from '@/repositories/expense.repository.js';
import type { CreateExpenseInput } from '@/schemas/expense.schema.js';

async function createExpense(userId: string, input: CreateExpenseInput) {
  const amount = String(input.amount);

  const newExpense = await expenseRepository.createExpense({
    userId,
    title: input.title,
    description: input.description,
    category: input.category,
    amount,
  });

  return newExpense;
}

async function getAllExpenses(userId: string) {
  const userExpenses = await expenseRepository.getAllExpensesByUserId(userId);

  return userExpenses;
}

export const expenseService = {
  createExpense,
  getAllExpenses,
};
