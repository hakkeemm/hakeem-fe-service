import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';

export type DoctorProfileStatItem = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
};

export interface DoctorProfileStatCardProps {
  item: DoctorProfileStatItem;
}

export function DoctorProfileStatCard({ item }: DoctorProfileStatCardProps) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={item.icon} size={20} color={colors.primary} />
      <Text style={styles.statValue} numberOfLines={1}>
        {item.value}
      </Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {item.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    ...typography.label,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
