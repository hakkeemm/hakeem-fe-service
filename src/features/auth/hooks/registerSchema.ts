import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
    fullName: z.string().min(1, 'auth.fullNameRequired').min(2, 'auth.fullNameMin'),
    phoneNumber: z
      .string()
      .min(1, 'auth.phoneRequired')
      .min(8, 'auth.phoneInvalid')
      .regex(/^[+0-9\s()-]+$/, 'auth.phoneInvalid'),
    password: z.string().min(1, 'auth.passwordRequired').min(6, 'auth.passwordMin'),
    confirmPassword: z.string().min(1, 'auth.passwordRequired'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'auth.passwordsMustMatch',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
