import { create } from 'zustand';

import type { AppLanguage } from '../i18n';

const LANGUAGE_STORAGE_KEY = 'hakeem_language';

interface LanguageState {
  language: AppLanguage | null;
  isHydrated: boolean;
  setLanguage: (language: AppLanguage) => void;
  setHydrated: (value: boolean) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: null,
  isHydrated: false,
  setLanguage: (language) => set({ language }),
  setHydrated: (value) => set({ isHydrated: value }),
}));

export { LANGUAGE_STORAGE_KEY };
