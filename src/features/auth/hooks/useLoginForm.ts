import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getApiErrorCode, getApiErrorMessage } from '../../../shared/api/errors';
import type { AuthStackParamList } from '../navigation/AuthNavigator';
import { useGoogleSignIn } from './useGoogleSignIn';
import { useLogin } from './useLogin';
import { loginSchema, type LoginFormValues } from './loginSchema';

export function useLoginForm(
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>,
) {
  const { t } = useTranslation();
  const login = useLogin();
  const googleSignIn = useGoogleSignIn();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await login.mutateAsync({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      const code = getApiErrorCode(error);
      if (code === 'Auth.EmailNotVerified') {
        navigation.navigate('VerifyEmail', { email: values.email.trim() });
        return;
      }
      setSubmitError(getApiErrorMessage(error, t('common.error')));
    }
  });

  const onGooglePress = async () => {
    setSubmitError(null);
    await googleSignIn.signInWithGoogle();
  };

  return {
    control: form.control,
    errors: form.formState.errors,
    submitError: submitError ?? googleSignIn.error,
    isSubmitting: login.isPending,
    isGoogleSubmitting: googleSignIn.isPending,
    isGoogleReady: googleSignIn.isReady,
    onSubmit,
    onGooglePress,
  };
}
