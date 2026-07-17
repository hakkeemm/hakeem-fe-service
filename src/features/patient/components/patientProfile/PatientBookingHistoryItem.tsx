import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import type { BookingHistoryItem } from '../../data/mockBookings';

export interface PatientBookingHistoryItemProps {
  booking: BookingHistoryItem;
  onDoctorPress: (doctorId: string) => void;
}

export function PatientBookingHistoryItem({
  booking,
  onDoctorPress,
}: PatientBookingHistoryItemProps) {
  const { i18n } = useTranslation();
  const { isRTL } = useRTL();

  const { dateLabel, timeLabel } = useMemo(() => {
    const date = new Date(booking.scheduledAt);
    const locale = i18n.language === 'ar' ? 'ar' : 'en';
    return {
      dateLabel: date.toLocaleDateString(locale, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      timeLabel: date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }, [booking.scheduledAt, i18n.language]);

  return (
    <Pressable
      onPress={() => onDoctorPress(booking.doctorId)}
      accessibilityRole="button"
      accessibilityLabel={booking.doctor.name}
      style={({ pressed }) => [styles.card, isRTL && styles.rowReverse, pressed && styles.pressed]}
    >
      <Image source={{ uri: booking.doctor.imageUrl }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={[styles.doctorName, isRTL && styles.rtlText]} numberOfLines={1}>
          {booking.doctor.name}
        </Text>
        <Text style={[styles.meta, isRTL && styles.rtlText]} numberOfLines={1}>
          {dateLabel} · {timeLabel}
        </Text>
        <Text style={[styles.specialty, isRTL && styles.rtlText]} numberOfLines={1}>
          {booking.doctor.specialty}
        </Text>
      </View>
      <View style={isRTL ? styles.mirror : undefined}>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  pressed: {
    opacity: 0.88,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  doctorName: {
    ...typography.label,
    fontSize: 15,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  specialty: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
