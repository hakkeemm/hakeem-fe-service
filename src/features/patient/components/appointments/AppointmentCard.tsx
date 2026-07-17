import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useRTL } from '../../../../shared/hooks/useRTL';
import {
  formatLocaleCurrency,
  formatLocaleDate,
  formatLocaleNumber,
  formatLocaleTime,
} from '../../../../shared/i18n/formatLocale';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import type { UpcomingAppointmentItem } from '../../data/mockAppointments';
import { AppointmentCountdown } from './AppointmentCountdown';

export interface AppointmentCardProps {
  appointment: UpcomingAppointmentItem;
  onPress?: (appointmentId: string) => void;
  onDoctorPress?: (doctorId: string) => void;
}

export function AppointmentCard({
  appointment,
  onPress,
  onDoctorPress,
}: AppointmentCardProps) {
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  const language = i18n.language;

  const { dateLabel, timeLabel, feeLabel, orderLabel } = useMemo(() => {
    const date = new Date(appointment.scheduledAt);
    return {
      dateLabel: formatLocaleDate(date, language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      timeLabel: formatLocaleTime(date, language),
      feeLabel: formatLocaleCurrency(appointment.fee, language),
      orderLabel: t('patient.slotAssignedOrder', {
        order: formatLocaleNumber(appointment.queuePosition, language),
      }),
    };
  }, [appointment.fee, appointment.queuePosition, appointment.scheduledAt, language, t]);

  const statusLabel =
    appointment.status === 'confirmed'
      ? t('patient.appointmentStatusConfirmed')
      : t('patient.appointmentStatusPending');

  const visitTypeLabel =
    appointment.visitType === 'clinic'
      ? t('patient.slotVisitClinic')
      : t('patient.slotVisitOnline');

  const purposeLabel =
    appointment.purpose === 'first'
      ? t('patient.slotPurposeFirst')
      : t('patient.slotPurposeFollowUp');

  const notes = appointment.noteKey ? t(`patient.${appointment.noteKey}`) : null;

  return (
    <Pressable
      onPress={() => onPress?.(appointment.id)}
      accessibilityRole="button"
      accessibilityLabel={t('patient.appointmentDetails')}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.header, isRTL && styles.rowReverse]}>
        <Pressable
          onPress={() => onDoctorPress?.(appointment.doctorId)}
          accessibilityRole="button"
          accessibilityLabel={appointment.doctor.name}
          style={[styles.doctorRow, isRTL && styles.rowReverse]}
        >
          <Image source={{ uri: appointment.doctor.imageUrl }} style={styles.avatar} />
          <View style={styles.doctorText}>
            <Text style={[styles.doctorName, isRTL && styles.rtlText]} numberOfLines={1}>
              {appointment.doctor.name}
            </Text>
            <Text style={[styles.specialty, isRTL && styles.rtlText]} numberOfLines={1}>
              {appointment.doctor.specialty}
            </Text>
            <Text style={[styles.hospital, isRTL && styles.rtlText]} numberOfLines={1}>
              {appointment.doctor.hospital}
            </Text>
          </View>
        </Pressable>
        <View
          style={[
            styles.statusBadge,
            appointment.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              appointment.status === 'confirmed'
                ? styles.statusTextConfirmed
                : styles.statusTextPending,
            ]}
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <DetailRow
          icon="calendar-outline"
          label={t('patient.appointmentDate')}
          value={dateLabel}
          isRTL={isRTL}
        />
        <DetailRow
          icon="time-outline"
          label={t('patient.appointmentTime')}
          value={timeLabel}
          isRTL={isRTL}
        />
        <DetailRow
          icon="business-outline"
          label={t('patient.slotVisitType')}
          value={visitTypeLabel}
          isRTL={isRTL}
        />
        <DetailRow
          icon="medkit-outline"
          label={t('patient.slotPurpose')}
          value={purposeLabel}
          isRTL={isRTL}
        />
        <DetailRow
          icon="people-outline"
          label={t('patient.slotAssignedOrderLabel')}
          value={orderLabel}
          isRTL={isRTL}
        />
        <DetailRow
          icon="cash-outline"
          label={t('patient.fees')}
          value={feeLabel}
          isRTL={isRTL}
        />
      </View>

      {notes ? <Text style={[styles.notes, isRTL && styles.rtlText]}>{notes}</Text> : null}

      <View style={styles.countdownWrap}>
        <AppointmentCountdown scheduledAt={appointment.scheduledAt} />
      </View>
    </Pressable>
  );
}

function DetailRow({
  icon,
  label,
  value,
  isRTL,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  isRTL: boolean;
}) {
  return (
    <View style={[styles.detailRow, isRTL && styles.rowReverse]}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>{label}</Text>
      <Text style={[styles.detailValue, isRTL && styles.rtlText]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.92,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
  },
  doctorText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  doctorName: {
    ...typography.label,
    fontSize: 15,
    color: colors.text,
  },
  specialty: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  hospital: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  statusConfirmed: {
    backgroundColor: colors.successLight,
  },
  statusPending: {
    backgroundColor: colors.primaryLight,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 11,
  },
  statusTextConfirmed: {
    color: colors.success,
  },
  statusTextPending: {
    color: colors.primaryDark,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  details: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 88,
  },
  detailValue: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  notes: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: spacing.sm,
  },
  countdownWrap: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: spacing.md,
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
