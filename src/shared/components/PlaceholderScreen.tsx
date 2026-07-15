import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { useAuthSession } from '../hooks/useAuthSession';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
  showLogout?: boolean;
  showEmptyDemo?: boolean;
}

export function PlaceholderScreen({
  title,
  subtitle,
  showLogout = false,
  showEmptyDemo = false,
}: PlaceholderScreenProps) {
  const { t } = useTranslation();
  const { logout, user } = useAuthSession();

  if (showEmptyDemo) {
    return <EmptyState title={title} message={subtitle ?? t('common.empty')} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>{t('common.appName')}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {user ? (
        <Text style={styles.meta}>
          {user.name} · {user.role}
        </Text>
      ) : null}
      {showLogout ? (
        <Button label={t('common.logout')} variant="ghost" onPress={() => void logout()} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  brand: {
    ...typography.display,
    color: colors.primary,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
});
