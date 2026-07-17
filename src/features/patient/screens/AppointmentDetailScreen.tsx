import React, { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { EmptyState } from '../../../shared/components/EmptyState';
import { spacing } from '../../../shared/theme/spacing';
import { AppointmentDetailPanel } from '../components/appointments';
import { PatientProfileHero } from '../components/patientProfile';
import { getUpcomingAppointmentById } from '../data/mockAppointments';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';

type Navigation = NativeStackNavigationProp<PatientStackParamList, 'AppointmentDetail'>;
type Route = RouteProp<PatientStackParamList, 'AppointmentDetail'>;

const PAGE_BACKGROUND = '#F4F6F8';

export function AppointmentDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const appointment = useMemo(
    () => getUpcomingAppointmentById(route.params.appointmentId),
    [route.params.appointmentId],
  );

  if (!appointment) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <PatientProfileHero
          title={t('patient.appointmentDetails')}
          onBackPress={() => navigation.goBack()}
          backLabel={t('common.back')}
        />
        <EmptyState title={t('patient.appointmentNotFound')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <PatientProfileHero
        title={t('patient.appointmentDetails')}
        onBackPress={() => navigation.goBack()}
        backLabel={t('common.back')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppointmentDetailPanel
          appointment={appointment}
          onDoctorPress={(doctorId) => navigation.navigate('DoctorProfile', { doctorId })}
          onCancelPress={() => {
            Alert.alert(t('patient.appointmentCancelledTitle'));
            navigation.goBack();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PAGE_BACKGROUND,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
