import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import {
  getDoctorBookingHorizonDays,
  getDoctorWorkingPeriods,
  getDoctorWorkingWeekdays,
  type SlotPeriod,
} from '../../data/mockDoctorSchedule';

export interface DoctorProfileAvailabilityProps {
  doctorId: string;
}

const PERIOD_LABEL_KEYS: Record<SlotPeriod, string> = {
  morning: 'patient.slotPeriodMorning',
  afternoon: 'patient.slotPeriodAfternoon',
  evening: 'patient.slotPeriodEvening',
};

function formatWeekdayLabels(weekdays: number[], locale: string): string {
  // Use a fixed week starting Sunday so weekday index matches Date#getDay().
  const base = new Date(2024, 0, 7);
  return weekdays
    .slice()
    .sort((a, b) => a - b)
    .map((weekday) => {
      const date = new Date(base);
      date.setDate(base.getDate() + weekday);
      return date.toLocaleDateString(locale, { weekday: 'long' });
    })
    .join(' · ');
}

export function DoctorProfileAvailability({ doctorId }: DoctorProfileAvailabilityProps) {
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  const locale = i18n.language === 'ar' ? 'ar' : 'en';

  const workingWeekdays = useMemo(() => getDoctorWorkingWeekdays(doctorId), [doctorId]);
  const workingPeriods = useMemo(() => getDoctorWorkingPeriods(doctorId), [doctorId]);
  const bookingHorizonDays = useMemo(() => getDoctorBookingHorizonDays(doctorId), [doctorId]);

  const workDaysLabel = useMemo(
    () => formatWeekdayLabels(workingWeekdays, locale),
    [locale, workingWeekdays],
  );

  const periodsLabel = workingPeriods.map((period) => t(PERIOD_LABEL_KEYS[period])).join(' · ');

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
        {t('patient.doctorAvailability')}
      </Text>

      <View style={styles.card}>
        <View style={[styles.row, isRTL && styles.rowReverse]}>
          <View style={styles.iconWrap}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>{t('patient.doctorWorkDays')}</Text>
            <Text style={[styles.value, isRTL && styles.rtlText]}>{workDaysLabel}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={[styles.row, isRTL && styles.rowReverse]}>
          <View style={styles.iconWrap}>
            <Ionicons name="time-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>
              {t('patient.doctorWorkPeriods')}
            </Text>
            <Text style={[styles.value, isRTL && styles.rtlText]}>{periodsLabel}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={[styles.row, isRTL && styles.rowReverse]}>
          <View style={styles.iconWrap}>
            <Ionicons name="hourglass-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>
              {t('patient.doctorBookingWindow')}
            </Text>
            <Text style={[styles.value, isRTL && styles.rtlText]}>
              {t('patient.doctorBookingWindowValue', { days: bookingHorizonDays })}
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
    ...typography.subtitle,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  value: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
