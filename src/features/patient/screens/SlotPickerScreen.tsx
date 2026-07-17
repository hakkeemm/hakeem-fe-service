import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { EmptyState } from '../../../shared/components/EmptyState';
import { spacing } from '../../../shared/theme/spacing';
import { PatientProfileHero } from '../components/patientProfile';
import {
  SlotBookingBar,
  SlotBookTypeSection,
  SlotDayAssignment,
  SlotDayPicker,
  SlotPatientDetailsSection,
} from '../components/slotPicker';
import { useSlotPickerState } from '../hooks/useSlotPickerState';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';

type Navigation = NativeStackNavigationProp<PatientStackParamList, 'SlotPicker'>;
type Route = RouteProp<PatientStackParamList, 'SlotPicker'>;

const PAGE_BACKGROUND = '#F4F6F8';

export function SlotPickerScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const doctorId = route.params.doctorId;

  const {
    doctor,
    schedule,
    selectedDate,
    visitType,
    purpose,
    assignedTime,
    queuePosition,
    fee,
    canBook,
    patientName,
    patientEmail,
    patientPhone,
    bookingForOther,
    selectDate,
    setVisitType,
    setPurpose,
    setPatientName,
    setPatientEmail,
    setPatientPhone,
    toggleBookingForOther,
  } = useSlotPickerState(doctorId);

  if (!doctor) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <PatientProfileHero
          title={t('patient.slotPicker')}
          onBackPress={() => navigation.goBack()}
          backLabel={t('common.back')}
        />
        <EmptyState title={t('patient.doctorNotFound')} />
      </SafeAreaView>
    );
  }

  if (schedule.days.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <PatientProfileHero
          title={t('patient.slotPicker')}
          onBackPress={() => navigation.goBack()}
          backLabel={t('common.back')}
        />
        <EmptyState title={t('patient.slotPickerEmpty')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <PatientProfileHero
        title={t('patient.slotPicker')}
        onBackPress={() => navigation.goBack()}
        backLabel={t('common.back')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SlotDayPicker
          schedule={schedule}
          selectedDate={selectedDate}
          onSelectDate={selectDate}
        />

        <SlotBookTypeSection
          visitType={visitType}
          purpose={purpose}
          onSelectVisitType={setVisitType}
          onSelectPurpose={setPurpose}
        />

        <SlotPatientDetailsSection
          patientName={patientName}
          patientEmail={patientEmail}
          patientPhone={patientPhone}
          bookingForOther={bookingForOther}
          onChangeName={setPatientName}
          onChangeEmail={setPatientEmail}
          onChangePhone={setPatientPhone}
          onToggleBookingForOther={toggleBookingForOther}
        />

        {canBook && assignedTime ? (
          <SlotDayAssignment time={assignedTime} order={queuePosition} />
        ) : null}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <SlotBookingBar
        fee={fee}
        disabled={!canBook}
        onPress={() => {
          if (
            !canBook ||
            !selectedDate ||
            !assignedTime ||
            !visitType ||
            !purpose
          ) {
            return;
          }
          navigation.navigate('BookingConfirm', {
            doctorId,
            date: selectedDate,
            time: assignedTime,
            visitType,
            purpose,
            queuePosition,
            fee,
            patientName: patientName.trim(),
            patientEmail: patientEmail.trim(),
            patientPhone: patientPhone.trim(),
            bookingForOther,
          });
        }}
      />
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
    gap: spacing.lg,
    paddingBottom: spacing.xxl + 96,
  },
  bottomSpacer: {
    height: spacing.md,
  },
});
