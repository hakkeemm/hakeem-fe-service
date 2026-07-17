import { z } from 'zod';

/** Same rules as auth password validation (ASP.NET Identity). */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const passwordField = z
  .string()
  .min(1, 'auth.passwordRequired')
  .min(8, 'auth.passwordMin')
  .regex(PASSWORD_REGEX, 'auth.passwordRegex');

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'auth.passwordRequired'),
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

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
