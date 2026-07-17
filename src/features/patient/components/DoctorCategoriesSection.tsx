import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { DOCTOR_CATEGORIES, type DoctorCategory } from '../data/mockCategories';
import { CategoryItem } from './CategoryItem';

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

export interface DoctorCategoriesSectionProps {
  onSeeAllPress?: () => void;
  onCategoryPress?: (category: DoctorCategory) => void;
}

export function DoctorCategoriesSection({
  onSeeAllPress,
  onCategoryPress,
}: DoctorCategoriesSectionProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  const getLabel = (id: DoctorCategory['id']) => t(`patient.categories.${id}`);

  return (
    <View style={styles.section}>
      <View style={[styles.header, isRTL && styles.headerRtl]}>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t('patient.findYourDoctor')}</Text>
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.row, isRTL && styles.rowRtl]}
      >
        {DOCTOR_CATEGORIES.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            label={getLabel(category.id)}
            variant="home"
            onPress={onCategoryPress}
          />
        ))}
      </ScrollView>
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingRight: spacing.xs,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
    paddingRight: 0,
    paddingLeft: spacing.xs,
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
