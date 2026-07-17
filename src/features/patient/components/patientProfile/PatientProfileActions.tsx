import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';

type ActionIcon = keyof typeof Ionicons.glyphMap;

type ActionItem = {
  key: string;
  label: string;
  icon: ActionIcon;
  onPress: () => void;
  danger?: boolean;
};

export interface PatientProfileActionsProps {
  onChangePassword: () => void;
  onChangeLanguage: () => void;
  onLogout: () => void;
  logoutLoading?: boolean;
}

export function PatientProfileActions({
  onChangePassword,
  onChangeLanguage,
  onLogout,
  logoutLoading = false,
}: PatientProfileActionsProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  const items: ActionItem[] = [
    {
      key: 'password',
      label: t('patient.changePassword'),
      icon: 'lock-closed-outline',
      onPress: onChangePassword,
    },
    {
      key: 'language',
      label: t('common.language'),
      icon: 'language-outline',
      onPress: onChangeLanguage,
    },
    {
      key: 'logout',
      label: t('common.logout'),
      icon: 'log-out-outline',
      onPress: onLogout,
      danger: true,
    },
  ];

  return (
    <View style={styles.card}>
      {items.map((item, index) => (
        <React.Fragment key={item.key}>
          {index > 0 ? <View style={styles.divider} /> : null}
          <Pressable
            onPress={item.onPress}
            disabled={item.key === 'logout' && logoutLoading}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={({ pressed }) => [
              styles.row,
              isRTL && styles.rowReverse,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.leading, isRTL && styles.rowReverse]}>
              <View
                style={[styles.iconWrap, item.danger ? styles.iconWrapDanger : styles.iconWrapDefault]}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={item.danger ? colors.error : colors.primary}
                />
              </View>
              <Text
                style={[styles.label, item.danger && styles.dangerLabel, isRTL && styles.rtlText]}
              >
                {item.label}
              </Text>
            </View>
            <View style={isRTL ? styles.mirror : undefined}>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>
          </Pressable>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginStart: 56,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  pressed: {
    backgroundColor: colors.primaryLight,
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDefault: {
    backgroundColor: colors.primaryLight,
  },
  iconWrapDanger: {
    backgroundColor: colors.errorLight,
  },
  label: {
    ...typography.body,
    color: colors.text,
    flexShrink: 1,
  },
  dangerLabel: {
    color: colors.error,
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
