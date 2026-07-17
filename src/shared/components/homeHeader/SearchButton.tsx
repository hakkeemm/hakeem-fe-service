import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { homeHeaderColors } from './homeHeaderUtils';
import { HeaderSearchIcon } from './homeHeaderIcons';

export interface SearchButtonProps {
  onPress?: () => void;
  active?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
  tone?: 'default' | 'onPrimary';
}

export function SearchButton({
  onPress,
  active = false,
  accessibilityLabel = 'Search',
  style,
  tone = 'default',
}: SearchButtonProps) {
  const onPrimary = tone === 'onPrimary';
  const iconColor = onPrimary || active ? (onPrimary ? colors.background : colors.primary) : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ expanded: active }}
      style={({ pressed }) => [
        styles.button,
        active && styles.active,
        onPrimary && styles.buttonOnPrimary,
        pressed && styles.pressed,
        style,
      ]}
    >
      <HeaderSearchIcon color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: homeHeaderColors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOnPrimary: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'rgba(255,255,255,0.35)',
  },
  active: {
    backgroundColor: colors.primaryLight,
  },
  pressed: {
    opacity: 0.85,
  },
});
