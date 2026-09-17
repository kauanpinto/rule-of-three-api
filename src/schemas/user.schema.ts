import * as z from 'zod';

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').optional(),
  income: z.number().positive('Renda deve ser maior que zero').optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const userSchema = {
  deleteAccountSchema,
  updateProfileSchema,
};
