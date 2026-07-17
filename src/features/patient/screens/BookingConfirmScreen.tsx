import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Button } from '../../../shared/components/Button';
import { spacing } from '../../../shared/theme/spacing';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { PatientProfileHero } from '../components/patientProfile';
import { getDoctorById } from '../data/mockDoctors';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';

type Navigation = NativeStackNavigationProp<PatientStackParamList, 'BookingConfirm'>;
type Route = RouteProp<PatientStackParamList, 'BookingConfirm'>;

const PAGE_BACKGROUND = '#F4F6F8';

export function BookingConfirmScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const {
    doctorId,
    date,
    time,
    visitType,
    purpose,
    queuePosition,
    fee,
    patientName,
    patientEmail,
    patientPhone,
  } = route.params;
  const doctor = getDoctorById(doctorId);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <PatientProfileHero
        title={t('patient.bookingConfirm')}
        onBackPress={() => navigation.goBack()}
        backLabel={t('common.back')}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{doctor?.name ?? t('patient.doctorNotFound')}</Text>
        <Text style={styles.line}>{date}</Text>
        <Text style={styles.line}>{time}</Text>
        <Text style={styles.line}>
          {visitType === 'clinic' ? t('patient.slotVisitClinic') : t('patient.slotVisitOnline')}
          {' · '}
          {purpose === 'first' ? t('patient.slotPurposeFirst') : t('patient.slotPurposeFollowUp')}
        </Text>
        <Text style={styles.line}>{t('patient.slotTimeQueue', { order: queuePosition })}</Text>
        <Text style={styles.line}>{patientName}</Text>
        <Text style={styles.line}>{patientEmail}</Text>
        <Text style={styles.line}>{patientPhone}</Text>
        <Text style={styles.fee}>${fee.toFixed(2)}</Text>
        <Button label={t('common.confirm')} onPress={() => navigation.navigate('Payment')} />
        <Button label={t('common.cancel')} variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PAGE_BACKGROUND,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  line: {
    ...typography.body,
    color: colors.textSecondary,
  },
  fee: {
    ...typography.subtitle,
    color: colors.primary,
    marginVertical: spacing.md,
  },
});
