import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../../shared/components/Button';
import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import { formatFee } from './doctorProfileFormat';

export interface DoctorProfileBookingBarProps {
  fee: number;
  onBookPress: () => void;
}

export function DoctorProfileBookingBar({ fee, onBookPress }: DoctorProfileBookingBarProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <View style={[styles.bottomBar, isRTL && styles.rowReverse]}>
      <View style={isRTL ? styles.selfEnd : undefined}>
        <Text style={styles.feeLabel}>{t('patient.consultationFee')}</Text>
        <Text style={styles.feeValue}>{formatFee(fee)}</Text>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  selfEnd: {
    alignSelf: 'flex-end',
  },
  feeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  feeValue: {
    ...typography.title,
    fontSize: 20,
    color: colors.primary,
  },
  bookButton: {
    flex: 1,
    maxWidth: 220,
  },
});
