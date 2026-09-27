import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .refine((password) => /[A-Z]/.test(password), 'A senha deve conter uma letra maiúscula')
  .refine((password) => /[a-z]/.test(password), 'A senha deve conter uma letra minúscula')
  .refine((password) => /[0-9]/.test(password), 'A senha deve conter um número')
  .refine((password) => /[!@#$%^&*]/.test(password), 'A senha deve conter um caractere especial');

const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.email('E-mail inválido'),
  password: passwordSchema,
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
  newPassword: passwordSchema,
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

const forgotPasswordSchema = z.object({
  email: z.email('E-mail inválido'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const authSchema = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
