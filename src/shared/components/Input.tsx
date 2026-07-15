import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { useRTL } from '../hooks/useRTL';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const { isRTL } = useRTL();

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, isRTL && styles.rtlText]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.disabled}
        style={[
          styles.input,
          isRTL ? styles.inputRtl : styles.inputLtr,
          error ? styles.inputError : null,
          style,
        ]}
        {...props}
      />
      {error ? <Text style={[styles.error, isRTL && styles.rtlText]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
  input: {
    ...typography.body,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputLtr: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  inputRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    ...typography.caption,
    color: colors.error,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
