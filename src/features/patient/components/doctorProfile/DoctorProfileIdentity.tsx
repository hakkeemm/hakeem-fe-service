import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import type { MockDoctor } from '../../data/mockDoctors';
import { formatCompact } from './doctorProfileFormat';

const STAR_COLOR = '#F5C518';

export interface DoctorProfileIdentityProps {
  doctor: MockDoctor;
}

export function DoctorProfileIdentity({ doctor }: DoctorProfileIdentityProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <View style={styles.identityInfo}>
      <Text style={styles.name} numberOfLines={1}>
        {doctor.name}
      </Text>
      <View style={styles.specialtyBadge}>
        <Text style={styles.specialtyBadgeText}>
          {t(`patient.categories.${doctor.specialtyId}`)}
        </Text>
      </View>
      <View style={[styles.hospitalRow, isRTL && styles.rowReverse]}>
        <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
        <Text style={[styles.hospital, isRTL && styles.rtlText]} numberOfLines={1}>
          {doctor.hospital}
        </Text>
      </View>
      <View style={[styles.ratingRow, isRTL && styles.rowReverse]}>
        <Ionicons name="star" size={14} color={STAR_COLOR} />
        <Text style={styles.ratingText}>
          {doctor.rating.toFixed(1)} ({formatCompact(doctor.reviewCount)})
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  identityInfo: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.title,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
    textAlign: 'center',
  },
  specialtyBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  specialtyBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  hospital: {
    ...typography.caption,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '500',
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
