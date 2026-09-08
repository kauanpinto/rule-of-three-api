import * as z from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  income: z.number().positive('Renda deve ser maior que zero'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginInput = z.infer<typeof loginSchema>;

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha é obrigatória'),
  newPassword: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const authSchema = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
};
