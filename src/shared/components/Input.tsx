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
import Svg, { Circle, Path } from 'react-native-svg';

import { useRTL } from '../hooks/useRTL';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export type AuthInputIcon = 'email' | 'lock' | 'phone' | 'user';

export interface InputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
  error?: string;
  /** Renders as a password field with show/hide toggle when true. */
  isPassword?: boolean;
  leadingIcon?: AuthInputIcon;
  /** Use auto for bilingual name fields so Arabic/Latin input follows typed script. */
  writingDirection?: 'auto' | 'ltr' | 'rtl';
  containerStyle?: ViewStyle;
}

const iconPaths: Record<AuthInputIcon, string> = {
  email:
    'M4 6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5v11c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 20 4 18.88 4 17.5v-11Zm2.5-.5a.5.5 0 0 0-.5.5v.72l6 3.75 6-3.75V6.5a.5.5 0 0 0-.5-.5h-11Zm11.5 3.58-5.47 3.42a1 1 0 0 1-1.06 0L6 9.58v7.92c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5V9.58Z',
  lock:
    'M7 10V8a5 5 0 0 1 10 0v2h.5A2.5 2.5 0 0 1 20 12.5v6A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-6A2.5 2.5 0 0 1 6.5 10H7Zm2 0h6V8a3 3 0 1 0-6 0v2Zm3 4a1.5 1.5 0 0 0-1 2.62V18a1 1 0 1 0 2 0v-1.38A1.5 1.5 0 0 0 12 14Z',
  phone:
    'M7.2 4.5 9.3 4c.73-.17 1.48.22 1.75.92l.95 2.46c.25.64.03 1.36-.53 1.75l-1.28.9a11.4 11.4 0 0 0 3.78 3.78l.9-1.28c.39-.56 1.11-.78 1.75-.53l2.46.95c.7.27 1.09 1.02.92 1.75l-.5 2.1A2.75 2.75 0 0 1 16.82 19C10.29 19 5 13.71 5 7.18A2.75 2.75 0 0 1 7.2 4.5Z',
  user:
    'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v.5c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5V19c0-2.76-3.58-5-8-5Z',
};

function LeadingIcon({ name }: { name: AuthInputIcon }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" style={styles.leadingIcon}>
      <Path fill={colors.textSecondary} d={iconPaths[name]} />
    </Svg>
  );
}

/** Open eye — tap to reveal password. */
function EyeIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        fill="none"
        stroke={colors.textSecondary}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
      />
      <Circle
        cx={12}
        cy={12}
        r={2.6}
        fill="none"
        stroke={colors.textSecondary}
        strokeWidth={1.8}
      />
    </Svg>
  );
}

/** Slashed eye — tap to hide password. */
function EyeOffIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        fill="none"
        stroke={colors.textSecondary}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
      />
      <Circle
        cx={12}
        cy={12}
        r={2.6}
        fill="none"
        stroke={colors.textSecondary}
        strokeWidth={1.8}
      />
      <Path
        fill="none"
        stroke={colors.textSecondary}
        strokeWidth={1.8}
        strokeLinecap="round"
        d="M4 4l16 16"
      />
    </Svg>
  );
}

export function Input({
  label,
  error,
  isPassword = false,
  leadingIcon,
  writingDirection,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [isSecure, setIsSecure] = useState(isPassword);
  const resolvedWritingDirection = writingDirection ?? (isRTL ? 'rtl' : 'ltr');
  const textDirectionStyle =
    resolvedWritingDirection === 'auto'
      ? [styles.inputAuto, isRTL ? styles.inputAutoRtl : styles.inputAutoLtr]
      : resolvedWritingDirection === 'rtl'
        ? styles.inputRtl
        : styles.inputLtr;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, isRTL && styles.rtlText]}>{label}</Text> : null}

      <View style={[styles.inputWrap, error ? styles.inputWrapError : null]}>
        {leadingIcon ? <LeadingIcon name={leadingIcon} /> : null}

        <TextInput
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={isPassword ? isSecure : false}
          style={[
            styles.input,
            isPassword && styles.inputWithToggle,
            textDirectionStyle,
            style,
          ]}
          {...props}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setIsSecure((prev) => !prev)}
            style={styles.toggle}
            accessibilityRole="button"
            accessibilityLabel={isSecure ? t('common.show') : t('common.hide')}
            hitSlop={8}
          >
            {isSecure ? <EyeIcon /> : <EyeOffIcon />}
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
  leadingIcon: {
    marginStart: spacing.md,
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
  inputAuto: {
    writingDirection: 'auto',
  },
  inputAutoLtr: {
    textAlign: 'left',
  },
  inputAutoRtl: {
    textAlign: 'right',
  },
  toggle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
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
