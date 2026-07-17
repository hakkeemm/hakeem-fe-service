import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { applyRtl, type AppLanguage } from '../../../shared/i18n';
import { Button } from '../../../shared/components/Button';
import { Modal } from '../../../shared/components/Modal';
import { LANGUAGE_STORAGE_KEY, useLanguageStore } from '../../../shared/store/languageStore';
import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import type { PatientStackParamList } from '../navigation/PatientStackNavigator';

type Navigation = NativeStackNavigationProp<PatientStackParamList, 'ProfileLanguage'>;

async function reloadApp(): Promise<void> {
  try {
    await Updates.reloadAsync();
  } catch {
    const { DevSettings } = await import('react-native');
    DevSettings.reload();
  }
}

export function ProfileLanguageScreen() {
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  const navigation = useNavigation<Navigation>();
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const current = useLanguageStore((state) => state.language) ?? 'ar';
  const [pendingRestart, setPendingRestart] = useState(false);

  const chooseLanguage = async (language: AppLanguage) => {
    await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, language);
    setLanguage(language);
    await i18n.changeLanguage(language);

    const needsRestart = await applyRtl(language);
    if (needsRestart) {
      setPendingRestart(true);
      return;
    }

    Alert.alert(t('common.language'), language === 'ar' ? 'العربية' : 'English');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={[styles.nav, isRTL && styles.navRtl]}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={styles.backButton}
          hitSlop={8}
        >
          <View style={isRTL ? styles.mirror : undefined}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </View>
        </Pressable>
        <View style={styles.backSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.selectLanguage')}</Text>

        <Pressable
          style={[styles.option, current === 'ar' && styles.optionActive]}
          onPress={() => void chooseLanguage('ar')}
        >
          <Text style={styles.optionText}>العربية</Text>
        </Pressable>

        <Pressable
          style={[styles.option, current === 'en' && styles.optionActive]}
          onPress={() => void chooseLanguage('en')}
        >
          <Text style={styles.optionText}>English</Text>
        </Pressable>

        <Button label={t('common.cancel')} variant="ghost" onPress={() => navigation.goBack()} />
      </View>

      <Modal
        visible={pendingRestart}
        title={t('common.language')}
        onClose={() => setPendingRestart(false)}
        primaryLabel={t('common.restartNow')}
        onPrimaryPress={() => void reloadApp()}
      >
        <Text style={styles.restartMessage}>{t('common.restartRequired')}</Text>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  navRtl: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backSpacer: {
    width: 44,
    height: 44,
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  option: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    ...typography.subtitle,
    color: colors.text,
    textAlign: 'center',
  },
  restartMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
