import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '../../theme/colors';
import { homeHeaderColors } from './homeHeaderUtils';

export interface NotificationButtonProps {
  onPress?: () => void;
  hasUnread?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

function BellIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 4.2 1.5 5.5 1.5 5.5H5s1.5-1.3 1.5-5.5Z"
      />
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 18.5a2 2 0 0 0 4 0"
      />
    </Svg>
  );
}

export function NotificationButton({
  onPress,
  hasUnread = false,
  accessibilityLabel = 'Notifications',
  style,
}: NotificationButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      <BellIcon color={colors.text} />
      {hasUnread ? <View style={styles.dot} /> : null}
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
  pressed: {
    opacity: 0.85,
  },
  dot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: homeHeaderColors.surface,
  },
});
