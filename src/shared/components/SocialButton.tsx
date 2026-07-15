import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface SocialButtonProps {
  provider: 'google';
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

function GoogleMark() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48" accessibilityElementsHidden>
      <Path
        fill={colors.google}
        d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h12.94c-.56 2.96-2.24 5.464-4.772 7.136v5.92h7.716c4.516-4.16 7.168-10.288 7.168-17.372z"
      />
      <Path
        fill={colors.googleGreen}
        d="M24.48 48c6.48 0 11.916-2.144 15.888-5.824l-7.716-5.92c-2.144 1.44-4.888 2.288-8.172 2.288-6.28 0-11.604-4.24-13.504-9.936H2.98v6.112C6.924 42.556 15.144 48 24.48 48z"
      />
      <Path
        fill={colors.googleYellow}
        d="M10.976 28.608A14.47 14.47 0 0 1 10.176 24c0-1.6.28-3.152.8-4.608v-6.112H2.98A23.93 23.93 0 0 0 .48 24c0 3.864.928 7.52 2.5 10.72l7.996-6.112z"
      />
      <Path
        fill={colors.googleRed}
        d="M24.48 9.456c3.528 0 6.696 1.216 9.188 3.6l6.884-6.884C36.388 2.272 30.952 0 24.48 0 15.144 0 6.924 5.444 2.98 13.28l7.996 6.112c1.9-5.696 7.224-9.936 13.504-9.936z"
      />
    </Svg>
  );
}

export function SocialButton({
  provider,
  label,
  onPress,
  accessibilityLabel,
  style,
}: SocialButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      {provider === 'google' ? <GoogleMark /> : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 52,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    ...typography.button,
    color: colors.googleText,
    fontWeight: '600',
  },
});
