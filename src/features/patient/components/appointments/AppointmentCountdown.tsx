import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useRTL } from '../../../../shared/hooks/useRTL';
import { formatLocalePaddedInt } from '../../../../shared/i18n/formatLocale';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import { useCountdown } from '../../hooks/useCountdown';

export interface AppointmentCountdownProps {
  scheduledAt: string;
}

export function AppointmentCountdown({ scheduledAt }: AppointmentCountdownProps) {
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  const { days, hours, minutes, seconds, isPast } = useCountdown(scheduledAt);
  const language = i18n.language;

  if (isPast) {
    return (
      <View style={styles.section}>
        <Text style={[styles.title, isRTL && styles.rtlText]}>
          {t('patient.appointmentCountdown')}
        </Text>
        <Text style={[styles.past, isRTL && styles.rtlText]}>
          {t('patient.appointmentCountdownPast')}
        </Text>
      </View>
    );
  }

  const units = [
    {
      key: 'days',
      value: formatLocalePaddedInt(days, language),
      label: t('patient.countdownDays'),
    },
    {
      key: 'hours',
      value: formatLocalePaddedInt(hours, language),
      label: t('patient.countdownHours'),
    },
    {
      key: 'minutes',
      value: formatLocalePaddedInt(minutes, language),
      label: t('patient.countdownMinutes'),
    },
    {
      key: 'seconds',
      value: formatLocalePaddedInt(seconds, language),
      label: t('patient.countdownSeconds'),
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={[styles.title, isRTL && styles.rtlText]}>
        {t('patient.appointmentCountdown')}
      </Text>
      <View style={[styles.row, isRTL && styles.rowRtl]}>
        {units.map((unit, index) => (
          <React.Fragment key={unit.key}>
            {index > 0 ? <Text style={styles.separator}>:</Text> : null}
            <View style={styles.unit}>
              <Text style={styles.value}>{unit.value}</Text>
              <Text style={styles.label}>{unit.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  title: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  unit: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  value: {
    ...typography.subtitle,
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    ...typography.subtitle,
    color: colors.primary,
    paddingHorizontal: 2,
  },
  past: {
    ...typography.bodySmall,
    color: colors.warning,
    fontWeight: '600',
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
