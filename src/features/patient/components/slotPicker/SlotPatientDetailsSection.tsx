import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '../../../../shared/components/Checkbox';
import { Input } from '../../../../shared/components/Input';
import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';

export interface SlotPatientDetailsSectionProps {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  bookingForOther: boolean;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
  onToggleBookingForOther: () => void;
}

export function SlotPatientDetailsSection({
  patientName,
  patientEmail,
  patientPhone,
  bookingForOther,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  onToggleBookingForOther,
}: SlotPatientDetailsSectionProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
        {t('patient.slotPatientDetails')}
      </Text>

      <Input
        label={t('auth.fullName')}
        placeholder={t('auth.fullName')}
        leadingIcon="user"
        writingDirection="auto"
        value={patientName}
        onChangeText={onChangeName}
        autoCapitalize="words"
        autoCorrect={false}
        autoComplete="name"
        textContentType="name"
      />

      <Input
        label={t('patient.slotPatientEmailOptional')}
        placeholder={t('patient.slotPatientEmailOptional')}
        leadingIcon="email"
        value={patientEmail}
        onChangeText={onChangeEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />

      <Input
        label={t('auth.phoneNumber')}
        placeholder={t('auth.phoneNumber')}
        leadingIcon="phone"
        value={patientPhone}
        onChangeText={onChangePhone}
        keyboardType="phone-pad"
        autoCorrect={false}
        autoComplete="tel"
        textContentType="telephoneNumber"
      />

      <Checkbox
        label={t('patient.slotBookingForOther')}
        checked={bookingForOther}
        onToggle={onToggleBookingForOther}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text,
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
