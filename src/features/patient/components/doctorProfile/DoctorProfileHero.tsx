import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CurvedHeaderBackground } from '../../../../shared/components/homeHeader';
import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import type { MockDoctor } from '../../data/mockDoctors';

export interface DoctorProfileHeroProps {
  title: string;
  doctor?: MockDoctor;
  onBackPress: () => void;
  backLabel: string;
}

export function DoctorProfileHero({
  title,
  doctor,
  onBackPress,
  backLabel,
}: DoctorProfileHeroProps) {
  const { isRTL } = useRTL();

  return (
    <View style={styles.hero}>
      <CurvedHeaderBackground color={colors.primary} contentStyle={styles.heroContent}>
        <View style={[styles.header, isRTL && styles.rowReverse]}>
          <Pressable
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            style={styles.iconButton}
            hitSlop={8}
          >
            <View style={isRTL ? styles.mirror : undefined}>
              <Ionicons name="chevron-back" size={22} color={colors.surface} />
            </View>
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.iconButtonSpacer} />
        </View>
        <View style={styles.heroSpacer} />
      </CurvedHeaderBackground>
      {doctor ? (
        <Image
          source={{ uri: doctor.imageUrl }}
          style={styles.heroAvatar}
          accessibilityLabel={doctor.name}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: 'relative',
    zIndex: 1,
  },
  heroContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  heroSpacer: {
    height: 56,
  },
  heroAvatar: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: colors.surface,
    backgroundColor: colors.primaryLight,
    alignSelf: 'center',
    bottom: -44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  headerTitle: {
    ...typography.subtitle,
    color: colors.surface,
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonSpacer: {
    width: 44,
    height: 44,
  },
});
