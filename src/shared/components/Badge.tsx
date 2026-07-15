import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type BadgeTone = 'default' | 'success' | 'warning' | 'error';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({ label, tone = 'default' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[tone]]}>
      <Text style={[styles.text, styles[`${tone}Text`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  default: {
    backgroundColor: colors.primaryLight,
  },
  success: {
    backgroundColor: colors.successLight,
  },
  warning: {
    backgroundColor: '#FFF4E5',
  },
  error: {
    backgroundColor: colors.errorLight,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
  defaultText: {
    color: colors.primaryDark,
  },
  successText: {
    color: colors.success,
  },
  warningText: {
    color: colors.warning,
  },
  errorText: {
    color: colors.error,
  },
});
