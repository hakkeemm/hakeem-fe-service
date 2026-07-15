import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { useRegister } from './useRegister';
import { registerSchema, type RegisterFormValues } from './registerSchema';

export function useSignUpForm() {
  const { t } = useTranslation();
  const register = useRegister();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      fullName: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const { confirmPassword: _confirmPassword, ...payload } = values;
      await register.mutateAsync(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('common.error');
      setSubmitError(message);
    }
  });

  return {
    control: form.control,
    errors: form.formState.errors,
    submitError,
    isSubmitting: register.isPending,
    onSubmit,
  };
}
