import { z } from 'zod';

import { emailField, fullNameField, passwordField } from './authValidation';

export const registerSchema = z
  .object({
    email: emailField,
    fullName: fullNameField,
    phoneNumber: z
      .string()
      .min(1, 'auth.phoneRequired')
      .min(8, 'auth.phoneInvalid')
      .regex(/^[+0-9\s()-]+$/, 'auth.phoneInvalid'),
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

export type RegisterFormValues = z.infer<typeof registerSchema>;
