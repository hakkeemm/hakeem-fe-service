import React from 'react';
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
import { emailField } from '../hooks/authValidation';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const forgotSchema = z.object({
  email: emailField,
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { email: '' },
  });

  const textAlign = isRTL ? 'right' : 'left';

  const onSubmit = handleSubmit(() => {
    navigation.navigate('ResetPassword');
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

            <Button label={t('auth.sendResetLink')} onPress={() => void onSubmit()} />
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
