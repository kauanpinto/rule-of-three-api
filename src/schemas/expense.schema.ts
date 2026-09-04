import * as z from 'zod';

const categoryEnum = z.enum(['ESSENTIALS', 'LEISURE', 'INVESTMENT']);

const createExpenseSchema = z.object({
  title: z.string().min(1, 'Nome muito curto'),
  description: z.string().optional(),
  amount: z.number().positive('Gasto deve ser maior que zero'),
  category: categoryEnum,
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export const expenseSchema = {
  createExpenseSchema,
};
