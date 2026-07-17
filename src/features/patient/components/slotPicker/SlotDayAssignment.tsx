import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';

export interface SlotDayAssignmentProps {
  time: string;
  order: number;
}

/** Shows the auto-assigned hour and queue order for the selected day. */
export function SlotDayAssignment({ time, order }: SlotDayAssignmentProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
        {t('patient.slotYourVisit')}
      </Text>

      <View style={styles.card}>
        <View style={[styles.row, isRTL && styles.rowReverse]}>
          <View style={styles.iconWrap}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>
              {t('patient.slotAssignedHourLabel')}
            </Text>
            <Text style={[styles.value, isRTL && styles.rtlText]}>
              {t('patient.slotAssignedHour', { time })}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={[styles.row, isRTL && styles.rowReverse]}>
          <View style={styles.iconWrap}>
            <Ionicons name="people-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>
              {t('patient.slotAssignedOrderLabel')}
            </Text>
            <Text style={[styles.value, isRTL && styles.rtlText]}>
              {t('patient.slotAssignedOrder', { order })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  value: {
    ...typography.bodySmall,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.primary,
    opacity: 0.25,
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
