import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { DOCTOR_CATEGORIES, type SpecialtyId } from '../data/mockCategories';
import { EGYPT_CITIES, type CityId } from '../data/mockCities';
import { CategoryItem } from './CategoryItem';

type FilterTab = 'category' | 'city';

export interface SpecialistFilterSheetProps {
  visible: boolean;
  selectedSpecialtyId?: SpecialtyId | null;
  selectedCityId?: CityId | null;
  onClose: () => void;
  onSelectSpecialty: (id: SpecialtyId | null) => void;
  onSelectCity: (id: CityId | null) => void;
}

export function SpecialistFilterSheet({
  visible,
  selectedSpecialtyId,
  selectedCityId,
  onClose,
  onSelectSpecialty,
  onSelectCity,
}: SpecialistFilterSheetProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<FilterTab>('category');

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text style={[styles.title, isRTL && styles.rtlText]}>{t('patient.filterTitle')}</Text>

          <View style={[styles.tabs, isRTL && styles.tabsRtl]}>
            <Pressable
              onPress={() => setTab('category')}
              accessibilityRole="button"
              accessibilityState={{ selected: tab === 'category' }}
              style={[styles.tab, tab === 'category' && styles.tabActive]}
            >
              <Text style={[styles.tabLabel, tab === 'category' && styles.tabLabelActive]}>
                {t('patient.filterByCategory')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTab('city')}
              accessibilityRole="button"
              accessibilityState={{ selected: tab === 'city' }}
              style={[styles.tab, tab === 'city' && styles.tabActive]}
            >
              <Text style={[styles.tabLabel, tab === 'city' && styles.tabLabelActive]}>
                {t('patient.filterByCity')}
              </Text>
            </Pressable>
          </View>

          {tab === 'category' ? (
            <FlatList
              data={DOCTOR_CATEGORIES}
              keyExtractor={(item) => item.id}
              numColumns={4}
              style={styles.list}
              contentContainerStyle={styles.grid}
              columnWrapperStyle={[styles.column, isRTL && styles.columnRtl]}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <CategoryItem
                  category={item}
                  label={t(`patient.categories.${item.id}`)}
                  variant="grid"
                  onPress={() => {
                    onSelectSpecialty(selectedSpecialtyId === item.id ? null : item.id);
                    onClose();
                  }}
                />
              )}
            />
          ) : (
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.cityList}
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.cityWrap, isRTL && styles.cityWrapRtl]}>
                {EGYPT_CITIES.map((city) => {
                  const selected = selectedCityId === city.id;
                  return (
                    <Pressable
                      key={city.id}
                      onPress={() => {
                        onSelectCity(selected ? null : city.id);
                        onClose();
                      }}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      style={[styles.cityChip, selected && styles.cityChipSelected]}
                    >
                      <Text
                        style={[styles.cityChipLabel, selected && styles.cityChipLabelSelected]}
                      >
                        {t(`patient.cities.${city.id}`)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    maxHeight: '75%',
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  tabsRtl: {
    flexDirection: 'row-reverse',
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tabLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.primaryDark,
  },
  list: {
    flexGrow: 0,
  },
  grid: {
    paddingBottom: spacing.sm,
  },
  column: {
    justifyContent: 'space-between',
  },
  columnRtl: {
    flexDirection: 'row-reverse',
  },
  cityList: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
  },
  cityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cityWrapRtl: {
    flexDirection: 'row-reverse',
  },
  cityChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cityChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cityChipLabel: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
  cityChipLabelSelected: {
    color: colors.surface,
  },
  rtlText: {
    writingDirection: 'rtl',
  },
});
