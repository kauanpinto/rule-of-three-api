import { db } from '@/db/client';
import { expenses } from '@/db/schema';

type CreateExpenseInput = {
  userId: string;
  title: string;
  description?: string;
  amount: string;
  category: 'ESSENTIALS' | 'LEISURE' | 'INVESTMENT';
};

export async function createExpense(data: CreateExpenseInput) {
  const [createdExpense] = await db.insert(expenses).values(data).returning();

  return createdExpense;
}
