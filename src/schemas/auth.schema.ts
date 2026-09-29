import { z } from 'zod';

const nameSchema = z.string().trim().min(2, 'Nome muito curto');

const emailSchema = z.string().trim().toLowerCase().pipe(z.email('E-mail inválido'));

const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .refine((p) => /[A-Z]/.test(p), 'A senha deve conter uma letra maiúscula')
  .refine((p) => /[a-z]/.test(p), 'A senha deve conter uma letra minúscula')
  .refine((p) => /[0-9]/.test(p), 'A senha deve conter um número')
  .refine((p) => /[!@#$%^&*]/.test(p), 'A senha deve conter um símbolo: ! @ # $ % ^ & *');

const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  income: z.number({ error: 'Informe sua renda' }).positive('Renda deve ser maior que zero'),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().trim().min(1, 'Senha é obrigatória'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().trim().min(1, 'Senha é obrigatória'),
  newPassword: passwordSchema,
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const authSchema = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
