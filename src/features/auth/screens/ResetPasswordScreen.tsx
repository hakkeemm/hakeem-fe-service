import React, { useEffect } from 'react';
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
import { z } from 'zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../../../shared/components/Button';
import { FormField } from '../../../shared/components/FormField';
import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { passwordField } from '../hooks/authValidation';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

const resetSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, 'auth.passwordRequired'),
  })
  .superRefine((values, ctx) => {
    if (values.confirmPassword.length === 0) {
      return;
    }

    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'auth.passwordsMustMatch',
        path: ['confirmPassword'],
      });
    }
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export function ResetPasswordScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    const subscription = form.watch((_value, info) => {
      if (info.name !== 'password') {
        return;
      }

      const confirmPassword = form.getValues('confirmPassword');
      if (confirmPassword.length > 0) {
        void form.trigger('confirmPassword');
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const textAlign = isRTL ? 'right' : 'left';

  const onSubmit = handleSubmit(() => {
    navigation.navigate('Login');
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
              <Text style={[styles.title, { textAlign }]}>{t('auth.resetPasswordTitle')}</Text>
              <Text style={[styles.subtitle, { textAlign }]}>
                {t('auth.resetPasswordSubtitle')}
              </Text>
            </View>

            <FormField
              control={control}
              name="password"
              placeholder={t('auth.newPassword')}
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

            <Button label={t('auth.resetPassword')} onPress={() => void onSubmit()} />
            <Button
              label={t('common.cancel')}
              variant="ghost"
              onPress={() => navigation.goBack()}
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
});
