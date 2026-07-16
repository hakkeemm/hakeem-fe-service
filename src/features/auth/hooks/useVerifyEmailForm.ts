import { useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getApiErrorMessage } from '../../../shared/api/errors';
import type { AuthStackParamList } from '../navigation/AuthNavigator';
import { useResendVerification, useVerifyEmail } from './useAuthMutations';
import { verifyEmailSchema, type VerifyEmailFormValues } from './verifyEmailSchema';

export function useVerifyEmailForm(
  navigation: NativeStackNavigationProp<AuthStackParamList, 'VerifyEmail'>,
  initialEmail: string,
) {
  const { t } = useTranslation();
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: initialEmail,
      code: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await verifyEmail.mutateAsync({
        email: values.email.trim(),
        code: values.code.trim(),
      });
      navigation.replace('Login');
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, t('common.error')));
    }
  });

  const onResend = async () => {
    const email = form.getValues('email').trim();
    if (!email) {
      setSubmitError(t('auth.emailRequired'));
      return;
    }

    setSubmitError(null);
    try {
      const result = await resendVerification.mutateAsync(email);
      Alert.alert(t('auth.verifyEmailTitle'), result.message || t('auth.codeResent'));
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, t('common.error')));
    }
  };

  return {
    control: form.control,
    errors: form.formState.errors,
    submitError,
    isSubmitting: verifyEmail.isPending,
    isResending: resendVerification.isPending,
    onSubmit,
    onResend,
  };
}
