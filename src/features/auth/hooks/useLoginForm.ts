import { useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { useLogin } from './useLogin';
import { loginSchema, type LoginFormValues } from './loginSchema';

export function useLoginForm() {
  const { t } = useTranslation();
  const login = useLogin();
  const [rememberMe, setRememberMe] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'patient',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await login.mutateAsync(values);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('common.error');
      setSubmitError(message);
    }
  });

  const onGooglePress = () => {
    Alert.alert(t('auth.login'), t('auth.googleComingSoon'));
  };

  const toggleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  return {
    control: form.control,
    errors: form.formState.errors,
    rememberMe,
    toggleRememberMe,
    submitError,
    isSubmitting: login.isPending,
    onSubmit,
    onGooglePress,
  };
}
