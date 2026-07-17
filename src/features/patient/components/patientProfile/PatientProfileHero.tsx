import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';

export interface PatientProfileHeroProps {
  title: string;
  onBackPress?: () => void;
  backLabel?: string;
}

/** Flat top bar — intentionally not the curved blue doctor-profile header. */
export function PatientProfileHero({ title, onBackPress, backLabel }: PatientProfileHeroProps) {
  const insets = useSafeAreaInsets();
  const { isRTL } = useRTL();
  const showBack = Boolean(onBackPress);

  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.md }]}>
      {showBack ? (
        <View style={[styles.row, isRTL && styles.rowRtl]}>
          <Pressable
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            style={styles.iconButton}
            hitSlop={8}
          >
            <View style={isRTL ? styles.mirror : undefined}>
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </View>
          </Pressable>
          <Text style={styles.headerTitleInRow}>{title}</Text>
          <View style={styles.iconButtonSpacer} />
        </View>
      ) : (
        <Text style={styles.headerTitle}>{title}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    minHeight: 44,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  headerTitle: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  headerTitleInRow: {
    ...typography.title,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonSpacer: {
    width: 44,
    height: 44,
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
});
