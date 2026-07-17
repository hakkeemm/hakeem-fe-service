import React, { useMemo } from 'react';
import { Alert, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../../../../shared/components/Button';
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

export interface AppointmentDetailPanelProps {
  appointment: UpcomingAppointmentItem;
  onDoctorPress: (doctorId: string) => void;
  onCancelPress?: () => void;
}

export function AppointmentDetailPanel({
  appointment,
  onDoctorPress,
  onCancelPress,
}: AppointmentDetailPanelProps) {
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
  const isClinic = appointment.visitType === 'clinic';

  const openDirections = async () => {
    const { latitude, longitude } = appointment.doctor.location;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('common.error'));
    }
  };

  const handleCancel = () => {
    Alert.alert(
      t('patient.appointmentCancelTitle'),
      t('patient.appointmentCancelMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('patient.appointmentCancelConfirm'),
          style: 'destructive',
          onPress: onCancelPress,
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.countdownCard}>
        <AppointmentCountdown scheduledAt={appointment.scheduledAt} />
      </View>

      <View style={styles.card}>
        <Pressable
          onPress={() => onDoctorPress(appointment.doctorId)}
          accessibilityRole="button"
          accessibilityLabel={appointment.doctor.name}
          style={[styles.doctorRow, isRTL && styles.rowReverse]}
        >
          <Image source={{ uri: appointment.doctor.imageUrl }} style={styles.avatar} />
          <View style={styles.doctorText}>
            <Text style={[styles.doctorName, isRTL && styles.rtlText]} numberOfLines={2}>
              {appointment.doctor.name}
            </Text>
            <Text style={[styles.specialty, isRTL && styles.rtlText]} numberOfLines={1}>
              {appointment.doctor.specialty}
            </Text>
            <Text style={[styles.hospital, isRTL && styles.rtlText]} numberOfLines={1}>
              {appointment.doctor.hospital}
            </Text>
          </View>
          <View style={isRTL ? styles.mirror : undefined}>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </View>
        </Pressable>

        <View style={styles.divider} />

        <View style={styles.details}>
          <DetailRow
            icon="checkmark-circle-outline"
            label={t('patient.appointmentStatus')}
            value={statusLabel}
            isRTL={isRTL}
          />
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

        <View style={styles.divider} />

        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
          {t('patient.slotPatientDetails')}
        </Text>
        <View style={styles.details}>
          <DetailRow
            icon="person-outline"
            label={t('auth.fullName')}
            value={appointment.patientName}
            isRTL={isRTL}
          />
          <DetailRow
            icon="mail-outline"
            label={t('auth.email')}
            value={appointment.patientEmail}
            isRTL={isRTL}
          />
          <DetailRow
            icon="call-outline"
            label={t('auth.phoneNumber')}
            value={appointment.patientPhone}
            isRTL={isRTL}
          />
          {appointment.bookingForOther ? (
            <DetailRow
              icon="people-circle-outline"
              label={t('patient.appointmentBookedFor')}
              value={t('patient.appointmentBookedForOther')}
              isRTL={isRTL}
            />
          ) : (
            <DetailRow
              icon="person-circle-outline"
              label={t('patient.appointmentBookedFor')}
              value={t('patient.appointmentBookedForSelf')}
              isRTL={isRTL}
            />
          )}
        </View>

        {notes ? <Text style={[styles.notes, isRTL && styles.rtlText]}>{notes}</Text> : null}
      </View>

      {isClinic ? (
        <View style={styles.card}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {t('patient.location')}
          </Text>
          <View style={[styles.addressRow, isRTL && styles.rowReverse]}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <Text style={[styles.addressText, isRTL && styles.rtlText]}>
              {appointment.doctor.address}
            </Text>
          </View>
          <Button
            label={t('patient.getDirections')}
            variant="secondary"
            onPress={() => void openDirections()}
          />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {t('patient.appointmentOnlineHintTitle')}
          </Text>
          <Text style={[styles.hint, isRTL && styles.rtlText]}>
            {t('patient.appointmentOnlineHint')}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <Button
          label={t('patient.appointmentViewDoctor')}
          onPress={() => onDoctorPress(appointment.doctorId)}
        />
        {onCancelPress ? (
          <Button
            label={t('patient.appointmentCancel')}
            variant="ghost"
            onPress={handleCancel}
            textStyle={styles.cancelText}
          />
        ) : null}
      </View>
    </View>
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
      <Text style={[styles.detailValue, isRTL && styles.rtlText]} numberOfLines={3}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  countdownCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 18,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
  },
  doctorText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  doctorName: {
    ...typography.subtitle,
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
  mirror: {
    transform: [{ scaleX: -1 }],
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
    width: 96,
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
  sectionTitle: {
    ...typography.label,
    color: colors.text,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  addressText: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  cancelText: {
    color: colors.error,
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
