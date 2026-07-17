import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import type { DoctorCategory } from '../data/mockCategories';

const HOME_ICON_SIZE = 56;
const GRID_ICON_SIZE = 48;

export interface CategoryItemProps {
  category: DoctorCategory;
  label: string;
  variant?: 'home' | 'grid';
  onPress?: (category: DoctorCategory) => void;
}

export function CategoryItem({ category, label, variant = 'home', onPress }: CategoryItemProps) {
  const { isRTL } = useRTL();
  const iconSize = variant === 'home' ? HOME_ICON_SIZE : GRID_ICON_SIZE;
  const circleSize = variant === 'home' ? 72 : 64;

  return (
    <Pressable
      onPress={() => onPress?.(category)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.root, variant === 'home' ? styles.rootHome : styles.rootGrid]}
    >
      <View
        style={[
          styles.circle,
          { width: circleSize, height: circleSize, borderRadius: circleSize / 2 },
        ]}
      >
        <Image
          source={{ uri: category.iconUrl }}
          style={{ width: iconSize, height: iconSize }}
          resizeMode="contain"
        />
      </View>
      <Text
        style={[styles.label, isRTL && styles.rtlText, variant === 'grid' && styles.labelGrid]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  rootHome: {
    width: 76,
    flexShrink: 0,
  },
  rootGrid: {
    flex: 1,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.lg,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  label: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
  },
  labelGrid: {
    fontSize: 11,
    lineHeight: 14,
  },
  rtlText: {
    writingDirection: 'rtl',
  },
});
