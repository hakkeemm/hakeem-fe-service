import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getApiErrorMessage } from '../../../shared/api/errors';
import { Button } from '../../../shared/components/Button';
import { FormField } from '../../../shared/components/FormField';
import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { useForgotPassword } from '../hooks/useAuthMutations';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../hooks/passwordResetSchemas';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const forgotPassword = useForgotPassword();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { email: '' },
  });

  const textAlign = isRTL ? 'right' : 'left';

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    const email = values.email.trim();
    try {
      await forgotPassword.mutateAsync({ email });
      navigation.navigate('ResetPassword', { email });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, t('common.error')));
    }
  });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={[styles.title, { textAlign }]}>{t('auth.forgotPasswordTitle')}</Text>
              <Text style={[styles.subtitle, { textAlign }]}>
                {t('auth.forgotPasswordSubtitle')}
              </Text>
            </View>

            <FormField
              control={control}
              name="email"
              placeholder={t('auth.email')}
              leadingIcon="email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              errorMessage={
                errors.email ? t(errors.email.message ?? 'auth.emailInvalid') : undefined
              }
            />

            {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

            <Button
              label={t('auth.sendResetCode')}
              onPress={() => void onSubmit()}
              loading={forgotPassword.isPending}
            />
            <Button
              label={t('common.cancel')}
              variant="ghost"
              onPress={() => navigation.goBack()}
              disabled={forgotPassword.isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  card: {
    width: '100%',
    gap: spacing.md,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  submitError: {
    ...typography.bodySmall,
    color: colors.error,
  },
});
