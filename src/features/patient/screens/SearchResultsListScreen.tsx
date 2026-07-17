import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { EmptyState } from '../../../shared/components/EmptyState';
import { homeHeaderColors } from '../../../shared/components/homeHeader';
import { spacing } from '../../../shared/theme/spacing';
import { DoctorCard } from '../components/DoctorCard';
import { DoctorScreenHeader } from '../components/DoctorScreenHeader';
import { SpecialistFilterSheet } from '../components/SpecialistFilterSheet';
import type { SpecialtyId } from '../data/mockCategories';
import { getNearbyDoctors, type MockDoctor } from '../data/mockDoctors';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';
import type { PatientTabParamList } from '../navigation/PatientTabNavigator';

type DoctorListNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<PatientTabParamList, 'Search'>,
  NativeStackNavigationProp<PatientStackParamList>
>;

export function SearchResultsListScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<DoctorListNavigation>();
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const hasActiveFilter = selectedSpecialty !== null || searchQuery.trim().length > 0;

  const doctors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return getNearbyDoctors().filter((doctor) => {
      if (selectedSpecialty && doctor.specialtyId !== selectedSpecialty) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.hospital.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, selectedSpecialty]);

  const handleDoctorPress = (_doctor: MockDoctor) => {
    navigation.navigate('DoctorProfile');
  };

  const clearFilters = () => {
    setSelectedSpecialty(null);
    setSearchQuery('');
    setIsSearchExpanded(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DoctorScreenHeader
        title={t('patient.doctor')}
        backAccessibilityLabel={t('common.back')}
        filterAccessibilityLabel={t('common.filter')}
        searchAccessibilityLabel={t('patient.search')}
        searchPlaceholder={t('patient.searchDoctors')}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        isSearchExpanded={isSearchExpanded}
        onSearchExpandedChange={setIsSearchExpanded}
        onBackPress={() => navigation.navigate('Home')}
        onFilterPress={() => setFilterVisible(true)}
      />

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.list, doctors.length === 0 && styles.listEmpty]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            bookLabel={t('patient.bookNow')}
            onPress={handleDoctorPress}
            onBookPress={handleDoctorPress}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title={t('patient.noDoctorsFound')}
            message={t('patient.noDoctorsFoundMessage')}
            actionLabel={hasActiveFilter ? t('patient.clearFilter') : undefined}
            onAction={hasActiveFilter ? clearFilters : undefined}
          />
        }
        ListFooterComponent={doctors.length > 0 ? <View style={styles.footerSpace} /> : null}
      />

      <SpecialistFilterSheet
        visible={filterVisible}
        selectedId={selectedSpecialty}
        onClose={() => setFilterVisible(false)}
        onSelect={setSelectedSpecialty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: homeHeaderColors.background,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  listEmpty: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.md,
  },
  footerSpace: {
    height: spacing.xxl + 48,
  },
});
