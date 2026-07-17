import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useRTL } from '../../hooks/useRTL';
import { spacing } from '../../theme/spacing';
import { NotificationButton, type NotificationButtonProps } from './NotificationButton';
import { SearchButton, type SearchButtonProps } from './SearchButton';

export interface HomeHeaderActionsProps {
  search: SearchButtonProps;
  notification: NotificationButtonProps;
  style?: ViewStyle;
}

/** Search + notification icon pair for home headers (reusable across roles). */
export function HomeHeaderActions({ search, notification, style }: HomeHeaderActionsProps) {
  const { isRTL } = useRTL();

  return (
    <View style={[styles.row, isRTL && styles.rowRtl, style]}>
      <SearchButton {...search} />
      <NotificationButton {...notification} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
});
