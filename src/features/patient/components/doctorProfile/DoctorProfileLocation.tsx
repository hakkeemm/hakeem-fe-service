import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import type { MockDoctor } from '../../data/mockDoctors';

export interface DoctorProfileLocationProps {
  doctor: MockDoctor;
}

export function DoctorProfileLocation({ doctor }: DoctorProfileLocationProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  const openDirections = async () => {
    const { latitude, longitude } = doctor.location;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('common.error'));
    }
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('patient.location')}</Text>
      <View style={[styles.addressRow, isRTL && styles.rowReverse]}>
        <Ionicons name="location-outline" size={18} color={colors.primary} />
        <Text style={[styles.addressText, isRTL && styles.rtlText]}>{doctor.address}</Text>
      </View>
      <Pressable
        onPress={() => void openDirections()}
        accessibilityRole="button"
        accessibilityLabel={t('patient.getDirections')}
        style={styles.mapCard}
      >
        <Ionicons name="map-outline" size={28} color={colors.primary} />
        <Text style={styles.mapText}>{t('patient.getDirections')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  addressText: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
  },
  mapCard: {
    height: 120,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  mapText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
