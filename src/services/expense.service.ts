import { createExpense as createExpenseRecord } from '@/repositories/expense.repository';
import type { CreateExpenseInput } from '@/schemas/expense.schema';

export async function createExpense(userId: string, input: CreateExpenseInput) {
  const amount = String(input.amount);

  const newExpense = await createExpenseRecord({
    userId,
    title: input.title,
    description: input.description,
    category: input.category,
    amount,
  });

  return newExpense;
}
