import { z } from 'zod';

const deleteAccountSchema = z.object({
  password: z.string().trim().min(1, 'Senha é obrigatória'),
});

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Nome muito curto').optional(),
  income: z
    .number({ error: 'Informe sua renda' })
    .positive('Renda deve ser maior que zero')
    .optional(),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const userSchema = {
  deleteAccountSchema,
  updateProfileSchema,
};
