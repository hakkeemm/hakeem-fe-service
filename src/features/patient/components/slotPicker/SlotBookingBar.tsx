import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../../shared/components/Button';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';

export interface SlotBookingBarProps {
  fee: number;
  disabled: boolean;
  onPress: () => void;
}

function formatFee(fee: number): string {
  return `$${fee.toFixed(2)}`;
}

export function SlotBookingBar({ fee, disabled, onPress }: SlotBookingBarProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.bottomBar}>
      <Button
        label={t('patient.bookWithFee', { price: formatFee(fee) })}
        onPress={onPress}
        disabled={disabled}
        style={styles.bookButton}
      />
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
