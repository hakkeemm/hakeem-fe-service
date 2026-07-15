import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface TextDividerProps {
  label: string;
  style?: ViewStyle;
}

export function TextDivider({ label, style }: TextDividerProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
