import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'Rule of Three <onboarding@resend.dev>';

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: to,
    subject: 'Bem-vindo ao Rule of Three!',
    html: `<p>Olá, ${name}! sua conta foi criada com sucesso.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: to,
    subject: 'Redefinição de senha — Rule of Three',
    html: `
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Este link expira em 1 hora.</p>
    `,
  });
}
