import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { useRTL } from '../hooks/useRTL';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export interface InputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
  error?: string;
  /** Renders as a password field with show/hide toggle when true. */
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  isPassword = false,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, isRTL && styles.rtlText]}>{label}</Text> : null}

      <View style={[styles.inputWrap, error ? styles.inputWrapError : null]}>
        <TextInput
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={isPassword ? isSecure : false}
          style={[
            styles.input,
            isPassword && styles.inputWithToggle,
            isRTL ? styles.inputRtl : styles.inputLtr,
            style,
          ]}
          {...props}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setIsSecure((prev) => !prev)}
            style={styles.toggle}
            accessibilityRole="button"
            hitSlop={8}
          >
            <Text style={styles.toggleText}>
              {isSecure ? t('common.show') : t('common.hide')}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={[styles.error, isRTL && styles.rtlText]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    width: '100%',
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
  inputWrap: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapError: {
    borderColor: colors.error,
  },
  input: {
    ...typography.body,
    flex: 1,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  inputWithToggle: {
    paddingEnd: spacing.xs,
  },
  inputLtr: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  inputRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  toggle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toggleText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
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
