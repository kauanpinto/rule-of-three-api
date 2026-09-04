import { eq, and } from 'drizzle-orm';
import { db } from '@/db/client.js';
import { expenses } from '@/db/schema.js';

type CreateExpenseInput = {
  userId: string;
  title: string;
  description?: string;
  amount: string;
  category: 'ESSENTIALS' | 'LEISURE' | 'INVESTMENT';
};

type UpdateExpenseInput = Partial<Omit<CreateExpenseInput, 'userId'>>;

async function createExpense(data: CreateExpenseInput) {
  const [createdExpense] = await db.insert(expenses).values(data).returning();
  return createdExpense;
}

async function getAllExpensesByUserId(userId: string) {
  const userExpenses = await db.select().from(expenses).where(eq(expenses.userId, userId));
  return userExpenses;
}

async function updateExpenseById(id: string, userId: string, data: UpdateExpenseInput) {
  const [updatedExpense] = await db
    .update(expenses)
    .set(data)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .returning();

  return updatedExpense;
}

export const expenseRepository = {
  createExpense,
  getAllExpensesByUserId,
  updateExpenseById,
};
