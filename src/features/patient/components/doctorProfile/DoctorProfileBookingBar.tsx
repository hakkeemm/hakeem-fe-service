import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../../shared/components/Button';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';

export interface DoctorProfileBookingBarProps {
  onBookPress: () => void;
}

export function DoctorProfileBookingBar({ onBookPress }: DoctorProfileBookingBarProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.bottomBar}>
      <Button label={t('patient.bookNow')} onPress={onBookPress} style={styles.bookButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookButton: {
    width: '100%',
  },
});
