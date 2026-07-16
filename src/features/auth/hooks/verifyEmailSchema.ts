import { z } from 'zod';

export const verifyEmailSchema = z.object({
  email: z.string().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
  code: z
    .string()
    .min(1, 'auth.codeRequired')
    .regex(/^\d{6}$/, 'auth.codeInvalid'),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
