import { eq } from 'drizzle-orm';
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

async function getAllExpensesByUserId(userId: string) {
  const userExpenses = await db.select().from(expenses).where(eq(expenses.userId, userId));

  return userExpenses;
}

export const expenseRepository = {
  createExpense,
  getAllExpensesByUserId,
};
