import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import { useSignUpForm } from '../hooks/useSignUpForm';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const { control, errors, submitError, isSubmitting, onSubmit } = useSignUpForm(navigation);
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
              <Text style={[styles.title, { textAlign }]}>{t('auth.signUpTitle')}</Text>
              <Text style={[styles.subtitle, { textAlign }]}>{t('auth.signUpSubtitle')}</Text>
            </View>

            <View style={styles.form}>
              <FormField
                control={control}
                name="fullName"
                placeholder={t('auth.fullName')}
                leadingIcon="user"
                writingDirection="auto"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="name"
                textContentType="name"
                errorMessage={
                  errors.fullName
                    ? t(errors.fullName.message ?? 'auth.fullNameRequired')
                    : undefined
                }
              />

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

              <FormField
                control={control}
                name="phoneNumber"
                placeholder={t('auth.phoneNumber')}
                leadingIcon="phone"
                keyboardType="phone-pad"
                autoCorrect={false}
                errorMessage={
                  errors.phoneNumber
                    ? t(errors.phoneNumber.message ?? 'auth.phoneInvalid')
                    : undefined
                }
              />

              <FormField
                control={control}
                name="password"
                placeholder={t('auth.password')}
                leadingIcon="lock"
                isPassword
                errorMessage={
                  errors.password
                    ? t(errors.password.message ?? 'auth.passwordRegex')
                    : undefined
                }
              />

              <FormField
                control={control}
                name="confirmPassword"
                placeholder={t('auth.confirmPassword')}
                leadingIcon="lock"
                isPassword
                errorMessage={
                  errors.confirmPassword
                    ? t(errors.confirmPassword.message ?? 'auth.passwordsMustMatch')
                    : undefined
                }
              />

              {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

              <Button
                label={t('auth.signUp')}
                onPress={() => void onSubmit()}
                loading={isSubmitting}
              />
            </View>

            <Text style={styles.footerRow}>
              {t('auth.alreadyHaveAccount')}{' '}
              <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
                {t('auth.login')}
              </Text>
            </Text>
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
  footerRow: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});
