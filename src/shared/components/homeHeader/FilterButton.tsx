import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface FilterButtonProps {
  onPress?: () => void;
  active?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

function FilterIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 5.5h15l-5.5 6.5v5l-4 2v-7L4.5 5.5Z"
      />
    </Svg>
  );
}

export function FilterButton({
  onPress,
  active = false,
  accessibilityLabel = 'Filter',
  style,
}: FilterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.button,
        active && styles.active,
        pressed && styles.pressed,
        style,
      ]}
      hitSlop={8}
    >
      <FilterIcon color={active ? colors.primary : colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  active: {
    backgroundColor: colors.primaryLight,
  },
  pressed: {
    opacity: 0.8,
  },
});
