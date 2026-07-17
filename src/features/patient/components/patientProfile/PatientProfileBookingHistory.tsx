import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

import { EmptyState } from '../../../../shared/components/EmptyState';
import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import type { BookingHistoryItem } from '../../data/mockBookings';
import { PatientBookingHistoryItem } from './PatientBookingHistoryItem';

const PREVIEW_LIMIT = 2;

function ChevronIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6l6 6-6 6"
      />
    </Svg>
  );
}

export interface PatientProfileBookingHistoryProps {
  bookings: BookingHistoryItem[];
  onDoctorPress: (doctorId: string) => void;
  onSeeAllPress?: () => void;
}

export function PatientProfileBookingHistory({
  bookings,
  onDoctorPress,
  onSeeAllPress,
}: PatientProfileBookingHistoryProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const preview = bookings.slice(0, PREVIEW_LIMIT);
  const showSeeAll = Boolean(onSeeAllPress) && bookings.length > PREVIEW_LIMIT;

  return (
    <View style={styles.section}>
      <View style={[styles.header, isRTL && styles.headerRtl]}>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t('patient.bookingHistory')}</Text>
        {showSeeAll ? (
          <Pressable
            onPress={onSeeAllPress}
            accessibilityRole="button"
            accessibilityLabel={t('patient.seeAll')}
            style={[styles.seeAll, isRTL && styles.seeAllRtl]}
            hitSlop={8}
          >
            <Text style={styles.seeAllText}>{t('patient.seeAll')}</Text>
            <View style={isRTL ? styles.chevronRtl : undefined}>
              <ChevronIcon color={colors.primary} />
            </View>
          </Pressable>
        ) : null}
      </View>

      {preview.length === 0 ? (
        <EmptyState title={t('patient.bookingHistoryEmpty')} />
      ) : (
        <View style={styles.list}>
          {preview.map((booking) => (
            <PatientBookingHistoryItem
              key={booking.id}
              booking={booking}
              onDoctorPress={onDoctorPress}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    flex: 1,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
  },
  seeAllRtl: {
    flexDirection: 'row-reverse',
  },
  seeAllText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  chevronRtl: {
    transform: [{ scaleX: -1 }],
  },
  list: {
    gap: spacing.sm,
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
