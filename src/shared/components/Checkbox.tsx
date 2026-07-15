import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useRTL } from '../hooks/useRTL';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  style?: ViewStyle;
}

export function Checkbox({ label, checked, onToggle, style }: CheckboxProps) {
  const { isRTL } = useRTL();

  return (
    <Pressable
      style={[styles.row, isRTL && styles.rowRtl, style]}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
