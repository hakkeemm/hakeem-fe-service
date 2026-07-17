import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useRTL } from '../../hooks/useRTL';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { getInitials, homeHeaderColors } from './homeHeaderUtils';

export interface UserGreetingProps {
  name: string;
  greeting: string;
  avatarUri?: string | null;
  onPress?: () => void;
  style?: ViewStyle;
}

export function UserGreeting({ name, greeting, avatarUri, onPress, style }: UserGreetingProps) {
  const { isRTL } = useRTL();
  const displayName = name.trim() || '—';
  const content = (
    <>
      <View style={styles.avatar}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarInitials}>{getInitials(displayName)}</Text>
        )}
      </View>
      <View style={[styles.textBlock, isRTL && styles.textBlockRtl]}>
        <Text style={[styles.greeting, isRTL && styles.rtlText]}>{greeting}</Text>
        <Text style={[styles.name, isRTL && styles.rtlText]} numberOfLines={1}>
          {displayName} 👋
        </Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.row, isRTL && styles.rowRtl, style]}
        accessibilityRole="button"
        accessibilityLabel={`${greeting}, ${displayName}`}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.row, isRTL && styles.rowRtl, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: homeHeaderColors.avatarFallback,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    ...typography.label,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  textBlock: {
    flexShrink: 1,
    gap: 2,
  },
  textBlockRtl: {
    alignItems: 'flex-end',
  },
  greeting: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  name: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: '700',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
