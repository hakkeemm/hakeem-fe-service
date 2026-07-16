import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getApiErrorMessage } from '../../../shared/api/errors';
import type { AuthStackParamList } from '../navigation/AuthNavigator';
import { useRegister } from './useRegister';
import { registerSchema, type RegisterFormValues } from './registerSchema';

export function useSignUpForm(
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>,
) {
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
      navigation.replace('VerifyEmail', { email: payload.email.trim() });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, t('common.error')));
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
