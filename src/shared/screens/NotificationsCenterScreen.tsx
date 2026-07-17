import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

import { EmptyState } from '../components/EmptyState';
import {
  NotificationKindIcon,
  NotificationMoreButton,
  type NotificationKind,
} from '../components/NotificationKindIcon';
import { useRTL } from '../hooks/useRTL';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAtLabel: string;
  kind: NotificationKind;
  unread?: boolean;
};

export interface NotificationsCenterScreenProps {
  /** Optional list; when omitted, demo seed data is shown. Pass `[]` for empty. */
  notifications?: AppNotification[];
}

const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'App Update',
    body: 'New update out now! Discover improved productivity tools and more.',
    createdAtLabel: '2 days ago',
    kind: 'update',
    unread: true,
  },
  {
    id: '2',
    title: 'Upgrade Offer',
    body: 'Get Lumina Premium now at 40% off for advanced productivity features!',
    createdAtLabel: '3 days ago',
    kind: 'offer',
    unread: true,
  },
  {
    id: '3',
    title: 'Appointment Reminder',
    body: 'Your appointment with Dr. Tatiana is tomorrow at 10:30 AM.',
    createdAtLabel: '5 days ago',
    kind: 'appointment',
    unread: false,
  },
];

function BackIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 6 9 12l6 6"
      />
    </Svg>
  );
}

export function NotificationsCenterScreen({
  notifications: notificationsProp,
}: NotificationsCenterScreenProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const navigation = useNavigation();
  const [items, setItems] = useState<AppNotification[]>(
    () => notificationsProp ?? DEMO_NOTIFICATIONS,
  );
  const [menuForId, setMenuForId] = useState<string | null>(null);

  const menuItem = useMemo(
    () => items.find((item) => item.id === menuForId) ?? null,
    [items, menuForId],
  );

  const closeMenu = () => setMenuForId(null);

  const markAsRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
    closeMenu();
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    closeMenu();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={[styles.header, isRTL && styles.headerRtl]}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={styles.backButton}
          hitSlop={8}
        >
          <View style={isRTL ? styles.backIconRtl : undefined}>
            <BackIcon color={colors.text} />
          </View>
        </Pressable>
        <Text style={styles.headerTitle}>{t('common.notificationsTitle')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {items.length === 0 ? (
        <EmptyState title={t('common.notifications')} message={t('common.notificationsEmpty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isMenuOpen = menuForId === item.id;
            return (
              <View style={[styles.row, isMenuOpen && styles.rowActive, isRTL && styles.rowRtl]}>
                <NotificationKindIcon kind={item.kind} />
                <View style={styles.rowText}>
                  <Text style={[styles.itemTitle, isRTL && styles.rtlText]}>{item.title}</Text>
                  <Text style={[styles.itemBody, isRTL && styles.rtlText]} numberOfLines={2}>
                    {item.body}
                  </Text>
                  <Text style={[styles.itemTime, isRTL && styles.rtlText]}>
                    {item.createdAtLabel}
                  </Text>
                </View>
                <NotificationMoreButton
                  accessibilityLabel={t('common.moreOptions')}
                  onPress={() => setMenuForId(item.id)}
                />
              </View>
            );
          }}
        />
      )}

      <Modal transparent visible={Boolean(menuItem)} animationType="fade" onRequestClose={closeMenu}>
        <Pressable style={styles.menuOverlay} onPress={closeMenu}>
          <View style={[styles.menuCard, isRTL && styles.menuCardRtl]}>
            {menuItem?.unread ? (
              <Pressable
                style={styles.menuAction}
                onPress={() => menuItem && markAsRead(menuItem.id)}
              >
                <Text style={[styles.menuActionText, isRTL && styles.rtlText]}>
                  {t('common.markAsRead')}
                </Text>
              </Pressable>
            ) : null}
            <Pressable
              style={styles.menuAction}
              onPress={() => menuItem && deleteItem(menuItem.id)}
            >
              <Text style={[styles.menuActionText, styles.menuDanger, isRTL && styles.rtlText]}>
                {t('common.delete')}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIconRtl: {
    transform: [{ scaleX: -1 }],
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...typography.subtitle,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
  },
  rowActive: {
    backgroundColor: '#F7F8FA',
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  rowText: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
  },
  itemTitle: {
    ...typography.subtitle,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.text,
  },
  itemBody: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  itemTime: {
    ...typography.caption,
    color: colors.textPlaceholder,
    marginTop: 4,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 29, 33, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  menuCard: {
    minWidth: 180,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  menuCardRtl: {
    alignItems: 'stretch',
  },
  menuAction: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuActionText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  menuDanger: {
    color: colors.error,
  },
});
