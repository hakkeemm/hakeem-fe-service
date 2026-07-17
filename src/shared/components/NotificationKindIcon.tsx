import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '../theme/colors';

export type NotificationKind = 'update' | 'offer' | 'appointment' | 'system';

const KIND_COLORS: Record<NotificationKind, { bg: string; fg: string }> = {
  update: { bg: '#E6F7F4', fg: '#1ABC9C' },
  offer: { bg: '#FDECEA', fg: '#E74C3C' },
  appointment: { bg: '#E8F1FD', fg: colors.primary },
  system: { bg: '#F3F4F6', fg: colors.textSecondary },
};

function UpdateIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v4M12 16v4M4 12h4M16 12h4"
      />
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 7.5 9 9M16.5 7.5 15 9M7.5 16.5 9 15M16.5 16.5 15 15"
      />
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 12a3.5 3.5 0 1 0 3.5-3.5"
      />
    </Svg>
  );
}

function OfferIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 10.5v7l7-3.5 9-5.5-7-3.5L4 10.5Z"
      />
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        d="M11 14v6.5"
      />
    </Svg>
  );
}

function AppointmentIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 5.5h11A2 2 0 0 1 19.5 7.5v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z"
      />
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        d="M8 3.8v3.2M16 3.8v3.2M4.5 9.5h15"
      />
    </Svg>
  );
}

function SystemIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5 19.5 8v8L12 19.5 4.5 16V8L12 4.5Z"
      />
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        d="M12 12v4M12 9.2v.2"
      />
    </Svg>
  );
}

export function NotificationKindIcon({ kind }: { kind: NotificationKind }) {
  const palette = KIND_COLORS[kind];

  return (
    <View style={[styles.circle, { backgroundColor: palette.bg }]}>
      {kind === 'update' ? <UpdateIcon color={palette.fg} /> : null}
      {kind === 'offer' ? <OfferIcon color={palette.fg} /> : null}
      {kind === 'appointment' ? <AppointmentIcon color={palette.fg} /> : null}
      {kind === 'system' ? <SystemIcon color={palette.fg} /> : null}
    </View>
  );
}

function MoreDots({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      />
    </Svg>
  );
}

export function NotificationMoreButton({
  onPress,
  accessibilityLabel,
}: {
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.moreButton}
    >
      <MoreDots color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
