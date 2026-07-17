import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { getPopularDoctors, type MockDoctor } from '../data/mockDoctors';
import { DoctorCard } from './DoctorCard';

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

export interface PopularDoctorsSectionProps {
  onSeeAllPress?: () => void;
  onDoctorPress?: (doctor: MockDoctor) => void;
  onBookPress?: (doctor: MockDoctor) => void;
}

export function PopularDoctorsSection({
  onSeeAllPress,
  onDoctorPress,
  onBookPress,
}: PopularDoctorsSectionProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const doctors = useMemo(() => getPopularDoctors(), []);

  return (
    <View style={styles.section}>
      <View style={[styles.header, isRTL && styles.headerRtl]}>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t('patient.popularDoctors')}</Text>
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
      </View>

      <View style={styles.list}>
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            feesLabel={t('patient.fees')}
            bookLabel={t('patient.bookNow')}
            onPress={onDoctorPress}
            onBookPress={onBookPress}
          />
        ))}
      </View>
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
