import { z } from 'zod';

const categoryEnum = z.enum(['ESSENTIALS', 'LEISURE', 'INVESTMENT']);

const createExpenseSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório'),
  description: z.string().trim().optional(),
  amount: z.number({ error: 'Informe seu gasto' }).positive('Gasto deve ser maior que zero'),
  category: categoryEnum,
});

const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

export const expenseSchema = {
  createExpenseSchema,
  updateExpenseSchema,
};
