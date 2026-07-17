import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { getApiErrorMessage } from '../../../shared/api/errors';
import { Button } from '../../../shared/components/Button';
import { FormField } from '../../../shared/components/FormField';
import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { useChangePassword } from '../../auth/hooks/useAuthMutations';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../hooks/changePasswordSchema';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';

type Navigation = NativeStackNavigationProp<PatientStackParamList, 'ChangePassword'>;

export function ChangePasswordScreen() {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const navigation = useNavigation<Navigation>();
  const changePassword = useChangePassword();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { currentPassword: '', password: '', confirmPassword: '' },
  });
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  useEffect(() => {
    const subscription = form.watch((_value, info) => {
      if (info.name === 'currentPassword') {
        clearErrors('currentPassword');
        setSubmitError(null);
        return;
      }
      if (info.name !== 'password') {
        return;
      }
      const confirmPassword = form.getValues('confirmPassword');
      if (confirmPassword.length > 0) {
        void form.trigger('confirmPassword');
      }
    });
    return () => subscription.unsubscribe();
  }, [clearErrors, form]);

  const textAlign = isRTL ? 'right' : 'left';
  const isBusy = changePassword.isPending;

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    clearErrors('currentPassword');
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.password,
      });
      Alert.alert(t('patient.changePassword'), t('patient.passwordChanged'), [
        { text: t('common.confirm'), onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const message = getApiErrorMessage(error, t('common.error'));
      if (/incorrect password/i.test(message)) {
        setError('currentPassword', {
          type: 'server',
          message: 'patient.incorrectPassword',
        });
        return;
      }
      setSubmitError(message);
    }
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={[styles.nav, isRTL && styles.navRtl]}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={styles.backButton}
          hitSlop={8}
          disabled={isBusy}
        >
          <View style={isRTL ? styles.mirror : undefined}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </View>
        </Pressable>
        <View style={styles.backSpacer} />
      </View>

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
              <Text style={[styles.title, { textAlign }]}>{t('patient.changePassword')}</Text>
            </View>

            <FormField
              control={control}
              name="currentPassword"
              placeholder={t('patient.currentPassword')}
              isPassword
              leadingIcon="lock"
              errorMessage={
                errors.currentPassword?.message
                  ? t(errors.currentPassword.message)
                  : undefined
              }
            />
            <FormField
              control={control}
              name="password"
              placeholder={t('auth.newPassword')}
              isPassword
              leadingIcon="lock"
              errorMessage={
                errors.password?.message
                  ? t(errors.password.message ?? 'auth.passwordRegex')
                  : undefined
              }
            />
            <FormField
              control={control}
              name="confirmPassword"
              placeholder={t('auth.confirmPassword')}
              isPassword
              leadingIcon="lock"
              errorMessage={
                errors.confirmPassword?.message
                  ? t(errors.confirmPassword.message)
                  : undefined
              }
            />
            <Text style={[styles.hint, { textAlign }]}>{t('auth.passwordRegex')}</Text>

            {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

            <Button
              label={t('common.save')}
              onPress={() => void onSubmit()}
              loading={isBusy}
            />
            <Button
              label={t('common.cancel')}
              variant="ghost"
              onPress={() => navigation.goBack()}
              disabled={isBusy}
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
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  navRtl: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backSpacer: {
    width: 44,
    height: 44,
  },
  mirror: {
    transform: [{ scaleX: -1 }],
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
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  submitError: {
    ...typography.bodySmall,
    color: colors.error,
  },
});
