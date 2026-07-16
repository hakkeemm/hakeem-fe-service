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
import { Checkbox } from '../../../shared/components/Checkbox';
import { FormField } from '../../../shared/components/FormField';
import { SocialButton } from '../../../shared/components/SocialButton';
import { TextDivider } from '../../../shared/components/TextDivider';
import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { useLoginForm } from '../hooks/useLoginForm';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const {
    control,
    errors,
    rememberMe,
    toggleRememberMe,
    submitError,
    isSubmitting,
    onSubmit,
    onGooglePress,
  } = useLoginForm(navigation);

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
              <Text style={[styles.title, { textAlign }]}>{t('auth.loginTitle')}</Text>
              <Text style={[styles.subtitle, { textAlign }]}>{t('auth.loginSubtitle')}</Text>
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
                name="password"
                placeholder={t('auth.password')}
                isPassword
                errorMessage={
                  errors.password
                    ? t(errors.password.message ?? 'auth.passwordRequired')
                    : undefined
                }
              />

              <View style={[styles.optionsRow, isRTL && styles.optionsRowRtl]}>
                <Checkbox
                  label={t('auth.rememberMe')}
                  checked={rememberMe}
                  onToggle={toggleRememberMe}
                />
                <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgot}>{t('auth.forgotPassword')}</Text>
                </Pressable>
              </View>

              {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

              <Button
                label={t('auth.login')}
                onPress={() => void onSubmit()}
                loading={isSubmitting}
              />
            </View>

            <View style={styles.socialSection}>
              <TextDivider label={t('auth.orSignInWith')} />
              <SocialButton
                provider="google"
                label={t('auth.continueWithGoogle')}
                onPress={onGooglePress}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.legal}>
                {t('auth.termsPrefix')}{' '}
                <Text style={styles.legalLink}>{t('auth.terms')}</Text> {t('auth.and')}{' '}
                <Text style={styles.legalLink}>{t('auth.privacy')}</Text>.
              </Text>

              <Text style={styles.signUpRow}>
                {t('auth.noAccountYet')}{' '}
                <Text style={styles.signUpLink} onPress={() => navigation.navigate('SignUp')}>
                  {t('auth.signUp')}
                </Text>
              </Text>

              <Pressable
                onPress={() => navigation.navigate('LanguageSelect')}
                style={styles.langLink}
              >
                <Text style={styles.langText}>{t('common.language')}</Text>
              </Pressable>
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
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionsRowRtl: {
    flexDirection: 'row-reverse',
  },
  forgot: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  submitError: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
  socialSection: {
    width: '100%',
    alignItems: 'stretch',
    gap: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  legal: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.sm,
  },
  legalLink: {
    color: colors.text,
    fontWeight: '700',
  },
  signUpRow: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  signUpLink: {
    color: colors.primary,
    fontWeight: '700',
  },
  langLink: {
    paddingVertical: spacing.xs,
  },
  langText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
