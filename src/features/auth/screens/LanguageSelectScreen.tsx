import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { applyRtl, type AppLanguage } from '../../../shared/i18n';
import { Button } from '../../../shared/components/Button';
import { Modal } from '../../../shared/components/Modal';
import { LANGUAGE_STORAGE_KEY, useLanguageStore } from '../../../shared/store/languageStore';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'LanguageSelect'>;

async function reloadApp(): Promise<void> {
  try {
    await Updates.reloadAsync();
  } catch {
    // Updates.reloadAsync is unavailable in Expo Go / some environments
    const { DevSettings } = await import('react-native');
    DevSettings.reload();
  }
}

export function LanguageSelectScreen({ navigation }: Props) {
  const { t, i18n } = useTranslation();
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
  };

  return (
    <View style={styles.container}>
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

      <Modal
        visible={pendingRestart}
        title={t('common.language')}
        onClose={() => setPendingRestart(false)}
        primaryLabel={t('common.restartNow')}
        onPrimaryPress={() => void reloadApp()}
      >
        <Text style={styles.restartMessage}>{t('common.restartRequired')}</Text>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.lg,
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
