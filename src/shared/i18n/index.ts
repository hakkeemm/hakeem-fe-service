import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { I18nManager } from 'react-native';

import ar from './ar.json';
import en from './en.json';

export type AppLanguage = 'ar' | 'en';

export function getDeviceDefaultLanguage(): AppLanguage {
  const primary = getLocales()[0]?.languageCode;
  if (primary === 'ar') {
    return 'ar';
  }
  return 'en';
}

export function isRtlLanguage(language: AppLanguage): boolean {
  return language === 'ar';
}

export async function applyRtl(language: AppLanguage): Promise<boolean> {
  const shouldBeRtl = isRtlLanguage(language);
  const currentlyRtl = I18nManager.isRTL;

  if (shouldBeRtl !== currentlyRtl) {
    I18nManager.allowRTL(shouldBeRtl);
    I18nManager.forceRTL(shouldBeRtl);
    return true;
  }

  return false;
}

export function initI18n(language: AppLanguage): typeof i18n {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      compatibilityJSON: 'v4',
      resources: {
        en: { translation: en },
        ar: { translation: ar },
      },
      lng: language,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
  } else {
    void i18n.changeLanguage(language);
  }

  return i18n;
}

export default i18n;
