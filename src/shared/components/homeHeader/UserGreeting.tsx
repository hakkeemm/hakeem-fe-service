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
  /** Use light text/avatar treatment on a primary-colored header. */
  tone?: 'default' | 'onPrimary';
}

export function UserGreeting({
  name,
  greeting,
  avatarUri,
  onPress,
  style,
  tone = 'default',
}: UserGreetingProps) {
  const { isRTL } = useRTL();
  const displayName = name.trim() || '—';
  const onPrimary = tone === 'onPrimary';
  const content = (
    <>
      <View style={[styles.avatar, onPrimary && styles.avatarOnPrimary]}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <Text style={[styles.avatarInitials, onPrimary && styles.avatarInitialsOnPrimary]}>
            {getInitials(displayName)}
          </Text>
        )}
      </View>
      <View style={[styles.textBlock, isRTL && styles.textBlockRtl]}>
        <Text
          style={[styles.greeting, onPrimary && styles.greetingOnPrimary, isRTL && styles.rtlText]}
        >
          {greeting}
        </Text>
        <Text
          style={[styles.name, onPrimary && styles.nameOnPrimary, isRTL && styles.rtlText]}
          numberOfLines={1}
        >
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
  avatarOnPrimary: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
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
  avatarInitialsOnPrimary: {
    color: colors.background,
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
  greetingOnPrimary: {
    color: 'rgba(255,255,255,0.85)',
  },
  name: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: '700',
  },
  nameOnPrimary: {
    color: colors.background,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
