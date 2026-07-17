import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { EmptyState } from '../../../shared/components/EmptyState';
import { spacing } from '../../../shared/theme/spacing';
import { AppointmentCard } from '../components/appointments';
import { PatientProfileHero } from '../components/patientProfile';
import { getUpcomingAppointments } from '../data/mockAppointments';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';
import type { PatientTabParamList } from '../navigation/PatientTabNavigator';

type Navigation = CompositeNavigationProp<
  BottomTabNavigationProp<PatientTabParamList, 'Appointments'>,
  NativeStackNavigationProp<PatientStackParamList>
>;

const PAGE_BACKGROUND = '#F4F6F8';

export function MyAppointmentsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Navigation>();
  const appointments = useMemo(() => getUpcomingAppointments(), []);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <PatientProfileHero title={t('patient.appointments')} />

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          appointments.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<EmptyState title={t('patient.appointmentsEmpty')} />}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onDoctorPress={(doctorId) => navigation.navigate('DoctorProfile', { doctorId })}
            onPress={(appointmentId) =>
              navigation.navigate('AppointmentDetail', { appointmentId })
            }
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
    paddingBottom: spacing.xxl + 96,
  },
  listEmpty: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.md,
  },
});
