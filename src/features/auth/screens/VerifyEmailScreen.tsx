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
import { OtpInput } from '../../../shared/components/OtpInput';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { useVerifyEmailForm } from '../hooks/useVerifyEmailForm';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyEmail'>;

export function VerifyEmailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const {
    code,
    errors,
    submitError,
    isSubmitting,
    isResending,
    canResend,
    resendCooldown,
    resendCountdownLabel,
    onCodeChange,
    onSubmit,
    onResend,
  } = useVerifyEmailForm(navigation, route.params.email);

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
              <Text style={styles.title}>{t('auth.verifyEmailTitle')}</Text>
              <Text style={styles.subtitle}>{t('auth.verifyEmailSubtitle')}</Text>
              <Text style={styles.email}>{route.params.email}</Text>
            </View>

            <View style={styles.form}>
              <OtpInput
                value={code}
                onChange={onCodeChange}
                disabled={isSubmitting}
                error={Boolean(errors.code) || Boolean(submitError)}
              />

              {errors.code ? (
                <Text style={styles.submitError}>
                  {t(errors.code.message ?? 'auth.codeInvalid')}
                </Text>
              ) : null}

              {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

              <View style={styles.resendBlock}>
                <Text style={styles.resendHint}>{t('auth.didntReceiveOtp')}</Text>
                {resendCooldown > 0 ? (
                  <Text style={styles.resendCountdown}>
                    {t('auth.resendCodeIn', {
                      time: resendCountdownLabel,
                      defaultValue: `Resend code in ${resendCountdownLabel}`,
                    })}
                  </Text>
                ) : (
                  <Pressable
                    onPress={() => void onResend()}
                    disabled={!canResend || isSubmitting}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !canResend || isSubmitting }}
                  >
                    <Text
                      style={[
                        styles.resendLink,
                        (!canResend || isSubmitting) && styles.resendDisabled,
                      ]}
                    >
                      {isResending ? t('common.loading') : t('auth.resendCode')}
                    </Text>
                  </Pressable>
                )}
              </View>

              <Button
                label={t('auth.verify')}
                onPress={() => void onSubmit()}
                loading={isSubmitting}
                disabled={code.length !== 6}
                style={styles.verifyButton}
              />
            </View>
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
    paddingBottom: spacing.xxl,
  },
  card: {
    width: '100%',
    gap: spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  email: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  form: {
    gap: spacing.lg,
    alignItems: 'center',
  },
  submitError: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
  resendBlock: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  resendHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  resendLink: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: '700',
    textAlign: 'center',
  },
  resendCountdown: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  resendDisabled: {
    opacity: 0.5,
  },
  verifyButton: {
    width: '100%',
    borderRadius: 999,
    marginTop: spacing.sm,
  },
});
