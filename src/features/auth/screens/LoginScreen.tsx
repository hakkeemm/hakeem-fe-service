import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import type { UserRole } from '../../../shared/types/user';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, type LoginFormValues } from '../hooks/loginSchema';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const ROLES: UserRole[] = ['patient', 'doctor', 'assistant'];

const ROLE_LABEL_KEYS: Record<
  UserRole,
  'auth.rolePatient' | 'auth.roleDoctor' | 'auth.roleAssistant'
> = {
  patient: 'auth.rolePatient',
  doctor: 'auth.roleDoctor',
  assistant: 'auth.roleAssistant',
};

export function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const login = useLogin();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@hakeem.app',
      password: 'password',
      role: 'patient',
    },
  });

  const selectedRole = useWatch({ control, name: 'role' });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await login.mutateAsync(values);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('common.error');
      setSubmitError(message);
      Alert.alert(t('common.error'), message);
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>{t('common.appName')}</Text>
      <Text style={styles.title}>{t('auth.loginTitle')}</Text>
      <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('auth.email')}
            autoCapitalize="none"
            keyboardType="email-address"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.email ? t(errors.email.message ?? 'auth.emailInvalid') : undefined}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('auth.password')}
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={
              errors.password ? t(errors.password.message ?? 'auth.passwordRequired') : undefined
            }
          />
        )}
      />

      <Text style={styles.roleLabel}>{t('auth.mockRole')}</Text>
      <View style={styles.roleRow}>
        {ROLES.map((role) => (
          <Pressable
            key={role}
            onPress={() => setValue('role', role)}
            style={[styles.roleChip, selectedRole === role && styles.roleChipActive]}
          >
            <Text style={[styles.roleText, selectedRole === role && styles.roleTextActive]}>
              {t(ROLE_LABEL_KEYS[role])}
            </Text>
          </Pressable>
        ))}
      </View>

      {submitError ? <Text style={styles.error}>{submitError}</Text> : null}

      <Button label={t('auth.login')} onPress={() => void onSubmit()} loading={login.isPending} />

      <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>{t('auth.forgotPassword')}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('LanguageSelect')}>
        <Text style={styles.link}>{t('common.language')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.md,
  },
  brand: {
    ...typography.display,
    color: colors.primary,
    textAlign: 'center',
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  roleLabel: {
    ...typography.label,
    color: colors.text,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  roleChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  roleChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  roleText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  roleTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  link: {
    ...typography.body,
    color: colors.secondary,
    textAlign: 'center',
  },
  error: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
});
