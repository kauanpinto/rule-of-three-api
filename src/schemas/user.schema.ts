import * as z from 'zod';

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

export const userSchema = {
  deleteAccountSchema,
};
