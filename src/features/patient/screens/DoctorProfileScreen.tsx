import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { EmptyState } from '../../../shared/components/EmptyState';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import {
  DoctorProfileAbout,
  DoctorProfileBookingBar,
  DoctorProfileHero,
  DoctorProfileIdentity,
  DoctorProfileLocation,
  DoctorProfileStats,
} from '../components/doctorProfile';
import { getDoctorById } from '../data/mockDoctors';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';

type DoctorProfileNavigation = NativeStackNavigationProp<PatientStackParamList, 'DoctorProfile'>;
type DoctorProfileRoute = RouteProp<PatientStackParamList, 'DoctorProfile'>;

export function DoctorProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<DoctorProfileNavigation>();
  const route = useRoute<DoctorProfileRoute>();
  const doctor = getDoctorById(route.params.doctorId);

  if (!doctor) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <DoctorProfileHero
          title={t('patient.doctorProfile')}
          onBackPress={() => navigation.goBack()}
          backLabel={t('common.back')}
        />
        <EmptyState title={t('patient.doctorNotFound')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <DoctorProfileHero
        title={t('patient.doctorProfile')}
        doctor={doctor}
        onBackPress={() => navigation.goBack()}
        backLabel={t('common.back')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <DoctorProfileIdentity doctor={doctor} />
        <DoctorProfileStats doctor={doctor} />
        <DoctorProfileAbout about={doctor.about} />
        <DoctorProfileLocation doctor={doctor} />
      </ScrollView>

      <DoctorProfileBookingBar onBookPress={() => navigation.navigate('SlotPicker')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: spacing.xxl + 96,
    gap: spacing.lg,
  },
});
