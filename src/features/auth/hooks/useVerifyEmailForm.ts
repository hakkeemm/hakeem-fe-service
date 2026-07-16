import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getApiErrorMessage } from '../../../shared/api/errors';
import type { AuthStackParamList } from '../navigation/AuthNavigator';
import { useResendVerification, useVerifyEmail } from './useAuthMutations';
import { verifyEmailSchema, type VerifyEmailFormValues } from './verifyEmailSchema';

const CODE_LENGTH = 6;
const FIRST_RESEND_COOLDOWN_SECONDS = 30;
const NEXT_RESEND_COOLDOWN_SECONDS = 60;

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function useVerifyEmailForm(
  navigation: NativeStackNavigationProp<AuthStackParamList, 'VerifyEmail'>,
  initialEmail: string,
) {
  const { t } = useTranslation();
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(FIRST_RESEND_COOLDOWN_SECONDS);
  const autoVerifyInFlightRef = useRef(false);

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: initialEmail,
      code: '',
    },
  });

  const code = form.watch('code');

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timerId = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [resendCooldown]);

  const submitVerification = useCallback(
    async (nextCode: string) => {
      const email = form.getValues('email').trim();
      const trimmedCode = nextCode.trim();

      if (!email || trimmedCode.length !== CODE_LENGTH || verifyEmail.isPending) {
        return;
      }

      setSubmitError(null);
      try {
        await verifyEmail.mutateAsync({
          email,
          code: trimmedCode,
        });
        navigation.replace('Login');
      } catch (error) {
        setSubmitError(getApiErrorMessage(error, t('common.error')));
        autoVerifyInFlightRef.current = false;
      }
    },
    [form, navigation, t, verifyEmail],
  );

  const onCodeChange = useCallback(
    (nextCode: string) => {
      const digitsOnly = nextCode.replace(/\D/g, '').slice(0, CODE_LENGTH);
      form.setValue('code', digitsOnly, { shouldValidate: digitsOnly.length === CODE_LENGTH });
      setSubmitError(null);

      if (digitsOnly.length === CODE_LENGTH && !autoVerifyInFlightRef.current) {
        autoVerifyInFlightRef.current = true;
        void submitVerification(digitsOnly);
      }

      if (digitsOnly.length < CODE_LENGTH) {
        autoVerifyInFlightRef.current = false;
      }
    },
    [form, submitVerification],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    autoVerifyInFlightRef.current = true;
    await submitVerification(values.code);
  });

  const onResend = async () => {
    if (resendCooldown > 0 || resendVerification.isPending) {
      return;
    }

    const email = form.getValues('email').trim();
    if (!email) {
      setSubmitError(t('auth.emailRequired'));
      return;
    }

    setSubmitError(null);
    form.setValue('code', '');
    autoVerifyInFlightRef.current = false;

    try {
      const result = await resendVerification.mutateAsync(email);
      setResendCooldown(NEXT_RESEND_COOLDOWN_SECONDS);
      Alert.alert(t('auth.verifyEmailTitle'), result.message || t('auth.codeResent'));
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, t('common.error')));
    }
  };

  const canResend = resendCooldown === 0 && !resendVerification.isPending;

  return {
    code,
    errors: form.formState.errors,
    submitError,
    isSubmitting: verifyEmail.isPending,
    isResending: resendVerification.isPending,
    canResend,
    resendCooldown,
    resendCountdownLabel: formatCountdown(resendCooldown),
    onCodeChange,
    onSubmit,
    onResend,
  };
}
