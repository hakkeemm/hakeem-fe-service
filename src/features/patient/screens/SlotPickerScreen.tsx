import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { EmptyState } from '../../../shared/components/EmptyState';
import { spacing } from '../../../shared/theme/spacing';
import { PatientProfileHero } from '../components/patientProfile';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';

type Navigation = NativeStackNavigationProp<PatientStackParamList, 'SlotPicker'>;

const PAGE_BACKGROUND = '#F4F6F8';

export function SlotPickerScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Navigation>();

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <PatientProfileHero
        title={t('patient.slotPicker')}
        onBackPress={() => navigation.goBack()}
        backLabel={t('common.back')}
      />
      <View style={styles.content}>
        <EmptyState title={t('patient.slotPickerEmpty')} />
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
    paddingTop: spacing.md,
  },
});
