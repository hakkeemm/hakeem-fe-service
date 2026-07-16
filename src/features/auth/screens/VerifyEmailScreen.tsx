import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../../../shared/components/Button';
import { FormField } from '../../../shared/components/FormField';
import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { useVerifyEmailForm } from '../hooks/useVerifyEmailForm';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyEmail'>;

export function VerifyEmailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const {
    control,
    errors,
    submitError,
    isSubmitting,
    isResending,
    onSubmit,
    onResend,
  } = useVerifyEmailForm(navigation, route.params.email);
  const textAlign = isRTL ? 'right' : 'left';

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
              <Text style={[styles.title, { textAlign }]}>{t('auth.verifyEmailTitle')}</Text>
              <Text style={[styles.subtitle, { textAlign }]}>
                {t('auth.verifyEmailSubtitle', { email: route.params.email })}
              </Text>
            </View>

            <View style={styles.form}>
              <FormField
                control={control}
                name="email"
                placeholder={t('auth.email')}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                errorMessage={
                  errors.email ? t(errors.email.message ?? 'auth.emailInvalid') : undefined
                }
              />

              <FormField
                control={control}
                name="code"
                placeholder={t('auth.verificationCode')}
                keyboardType="number-pad"
                maxLength={6}
                autoCorrect={false}
                errorMessage={
                  errors.code ? t(errors.code.message ?? 'auth.codeInvalid') : undefined
                }
              />

              {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

              <Button
                label={t('auth.verifyAndContinue')}
                onPress={() => void onSubmit()}
                loading={isSubmitting}
              />

              <Button
                label={t('auth.resendCode')}
                variant="ghost"
                onPress={() => void onResend()}
                loading={isResending}
                disabled={isSubmitting}
              />
            </View>

            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>{t('auth.backToLogin')}</Text>
            </Pressable>
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
    gap: spacing.xl,
  },
  header: {
    gap: spacing.sm,
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
  form: {
    gap: spacing.md,
  },
  submitError: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
  footerLink: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
});
