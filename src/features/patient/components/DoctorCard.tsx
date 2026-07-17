import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import type { MockDoctor } from '../data/mockDoctors';

const AVATAR_SIZE = 60;
const STAR_COLOR = '#F5C518';

function StarIcon({ color }: { color: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.77l-5.8 3.05 1.11-6.47-4.7-4.58 6.49-.94L12 2.5z"
      />
    </Svg>
  );
}

export interface DoctorCardProps {
  doctor: MockDoctor;
  bookLabel: string;
  onPress?: (doctor: MockDoctor) => void;
  onBookPress?: (doctor: MockDoctor) => void;
}

function formatReviews(count: number): string {
  return count.toLocaleString();
}

export function DoctorCard({ doctor, bookLabel, onPress, onBookPress }: DoctorCardProps) {
  const { isRTL } = useRTL();

  return (
    <Pressable
      onPress={() => onPress?.(doctor)}
      accessibilityRole="button"
      accessibilityLabel={doctor.name}
      style={[styles.card, isRTL && styles.cardRtl]}
    >
      <Image source={{ uri: doctor.imageUrl }} style={styles.avatar} />

      <View style={styles.middle}>
        <Text style={[styles.name, isRTL && styles.rtlText]} numberOfLines={1}>
          {doctor.name}
        </Text>
        <Text style={[styles.specialty, isRTL && styles.rtlText]} numberOfLines={1}>
          {doctor.specialty}
        </Text>
        <View style={[styles.ratingRow, isRTL && styles.ratingRowRtl]}>
          <StarIcon color={STAR_COLOR} />
          <Text style={styles.ratingText}>
            {doctor.rating.toFixed(1)} ({formatReviews(doctor.reviewCount)})
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => onBookPress?.(doctor)}
        accessibilityRole="button"
        accessibilityLabel={bookLabel}
        style={({ pressed }) => [styles.bookButton, pressed && styles.bookButtonPressed]}
      >
        <Text style={styles.bookLabel}>{bookLabel}</Text>
      </Pressable>
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  cardRtl: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.primaryLight,
  },
  middle: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  name: {
    ...typography.label,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
  },
  specialty: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  ratingRowRtl: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
  },
  ratingText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    flexShrink: 0,
  },
  bookButtonPressed: {
    opacity: 0.88,
  },
  bookLabel: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '600',
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
