import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { EmptyState } from '../../../shared/components/EmptyState';
import { spacing } from '../../../shared/theme/spacing';
import {
  PatientBookingHistoryItem,
  PatientProfileHero,
} from '../components/patientProfile';
import { getBookingHistory } from '../data/mockBookings';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';

type Navigation = NativeStackNavigationProp<PatientStackParamList, 'BookingHistory'>;

const PAGE_BACKGROUND = '#F4F6F8';

export function BookingHistoryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Navigation>();
  const bookings = useMemo(() => getBookingHistory(), []);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <PatientProfileHero
        title={t('patient.bookingHistory')}
        onBackPress={() => navigation.goBack()}
        backLabel={t('common.back')}
      />

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, bookings.length === 0 && styles.listEmpty]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<EmptyState title={t('patient.bookingHistoryEmpty')} />}
        renderItem={({ item }) => (
          <PatientBookingHistoryItem
            booking={item}
            onDoctorPress={(doctorId) => navigation.navigate('DoctorProfile', { doctorId })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PAGE_BACKGROUND,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  listEmpty: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.sm,
  },
});
