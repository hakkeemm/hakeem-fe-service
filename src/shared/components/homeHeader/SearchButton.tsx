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
}

export function SearchButton({
  onPress,
  active = false,
  accessibilityLabel = 'Search',
  style,
}: SearchButtonProps) {
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
        pressed && styles.pressed,
        style,
      ]}
    >
      <HeaderSearchIcon color={active ? colors.primary : colors.text} />
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
  active: {
    backgroundColor: colors.primaryLight,
  },
  pressed: {
    opacity: 0.85,
  },
});
