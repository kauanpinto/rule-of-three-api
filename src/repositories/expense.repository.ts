import { db } from '@/db/client.js';
import { expenses } from '@/db/schema.js';

type CreateExpenseInput = {
  userId: string;
  title: string;
  description?: string;
  amount: string;
  category: 'ESSENTIALS' | 'LEISURE' | 'INVESTMENT';
};

async function createExpense(data: CreateExpenseInput) {
  const [createdExpense] = await db.insert(expenses).values(data).returning();

  return createdExpense;
}

export const expenseRepository = {
  createExpense,
};
