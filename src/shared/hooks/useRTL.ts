import { I18nManager } from 'react-native';

import { isRtlLanguage } from '../i18n';
import { useLanguageStore } from '../store/languageStore';

export function useRTL(): { isRTL: boolean; language: 'ar' | 'en' | null } {
  const language = useLanguageStore((state) => state.language);
  const isRTL = language ? isRtlLanguage(language) : I18nManager.isRTL;
  return { isRTL, language };
}
