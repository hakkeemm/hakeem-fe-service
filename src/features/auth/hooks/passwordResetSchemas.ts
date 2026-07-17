import { z } from 'zod';

import { emailField, passwordField } from './authValidation';

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    code: z
      .string()
      .min(1, 'auth.codeRequired')
      .regex(/^\d{6}$/, 'auth.codeInvalid'),
    password: passwordField,
    confirmPassword: z.string().min(1, 'auth.passwordRequired'),
  })
  .superRefine((values, ctx) => {
    if (values.confirmPassword.length === 0) {
      return;
    }

    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'auth.passwordsMustMatch',
        path: ['confirmPassword'],
      });
    }
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
