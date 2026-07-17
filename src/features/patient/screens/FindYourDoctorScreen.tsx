import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { CategoryItem } from '../components/CategoryItem';
import { DOCTOR_CATEGORIES, type DoctorCategory } from '../data/mockCategories';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';

type FindYourDoctorNavigation = NativeStackNavigationProp<PatientStackParamList, 'FindYourDoctor'>;

function BackIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 6 9 12l6 6"
      />
    </Svg>
  );
}

function SearchIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
      />
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-4.3-4.3"
      />
    </Svg>
  );
}

export function FindYourDoctorScreen() {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const navigation = useNavigation<FindYourDoctorNavigation>();

  const getLabel = useCallback((id: DoctorCategory['id']) => t(`patient.categories.${id}`), [t]);

  const handleCategoryPress = useCallback(
    (_category: DoctorCategory) => {
      navigation.navigate('PatientTabs', { screen: 'Search' });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: DoctorCategory }) => (
      <CategoryItem
        category={item}
        label={getLabel(item.id)}
        variant="grid"
        onPress={handleCategoryPress}
      />
    ),
    [getLabel, handleCategoryPress],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={[styles.header, isRTL && styles.headerRtl]}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={styles.iconButton}
          hitSlop={8}
        >
          <View style={styles.backIconWrap}>
            <View style={isRTL ? styles.backIconRtl : undefined}>
              <BackIcon color={colors.text} />
            </View>
          </View>
        </Pressable>

        <Text style={styles.headerTitle}>{t('patient.findYourDoctor')}</Text>

        <Pressable
          onPress={() => navigation.navigate('PatientTabs', { screen: 'Search' })}
          accessibilityRole="button"
          accessibilityLabel={t('patient.search')}
          style={styles.iconButton}
          hitSlop={8}
        >
          <SearchIcon color={colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={DOCTOR_CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.list}
        columnWrapperStyle={[styles.column, isRTL && styles.columnRtl]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  headerTitle: {
    ...typography.subtitle,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  backIconRtl: {
    transform: [{ scaleX: -1 }],
  },
  list: {
    paddingHorizontal: spacing.lg - spacing.xs,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  column: {
    justifyContent: 'flex-start',
  },
  columnRtl: {
    flexDirection: 'row-reverse',
  },
});
