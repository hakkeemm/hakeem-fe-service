import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing } from '../../../../shared/theme/spacing';
import type { MockDoctor } from '../../data/mockDoctors';
import { formatCompact } from './doctorProfileFormat';
import {
  DoctorProfileStatCard,
  type DoctorProfileStatItem,
} from './DoctorProfileStatCard';

export interface DoctorProfileStatsProps {
  doctor: MockDoctor;
}

export function DoctorProfileStats({ doctor }: DoctorProfileStatsProps) {
  const { t } = useTranslation();

  const stats: DoctorProfileStatItem[] = [
    {
      key: 'patients',
      icon: 'people-outline',
      value: t('patient.patientsShort', { count: formatCompact(doctor.patientCount) }),
      label: t('patient.statPatients'),
    },
    {
      key: 'experience',
      icon: 'medkit-outline',
      value: t('patient.yearsShort', { count: doctor.experienceYears }),
      label: t('patient.statExperience'),
    },
    {
      key: 'rating',
      icon: 'star-outline',
      value: doctor.rating.toFixed(1),
      label: t('patient.statRating'),
    },
    {
      key: 'reviews',
      icon: 'chatbubble-ellipses-outline',
      value: formatCompact(doctor.reviewCount),
      label: t('patient.statReviews'),
    },
  ];

  return (
    <View style={styles.statsRow}>
      {stats.map((item) => (
        <DoctorProfileStatCard key={item.key} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
