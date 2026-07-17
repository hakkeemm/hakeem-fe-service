import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const PATIENT_PROFILE_STORAGE_KEY = 'hakeem_patient_profile';

export const DEFAULT_PATIENT_AVATAR =
  'https://randomuser.me/api/portraits/men/75.jpg';

type StoredPatientProfile = {
  displayName: string;
  avatarUri: string;
};

interface PatientProfileState {
  displayName: string;
  avatarUri: string;
  isHydrated: boolean;
  hydrateFromAuthName: (authName: string | undefined) => Promise<void>;
  setDisplayName: (name: string) => Promise<void>;
  setAvatarUri: (uri: string) => Promise<void>;
}

async function persistProfile(profile: StoredPatientProfile): Promise<void> {
  await SecureStore.setItemAsync(PATIENT_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export const usePatientProfileStore = create<PatientProfileState>((set, get) => ({
  displayName: '',
  avatarUri: DEFAULT_PATIENT_AVATAR,
  isHydrated: false,

  hydrateFromAuthName: async (authName) => {
    if (get().isHydrated) {
      return;
    }

    try {
      const raw = await SecureStore.getItemAsync(PATIENT_PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredPatientProfile;
        set({
          displayName: parsed.displayName || authName || '',
          avatarUri: parsed.avatarUri || DEFAULT_PATIENT_AVATAR,
          isHydrated: true,
        });
        return;
      }
    } catch {
      // Fall through to auth defaults.
    }

    set({
      displayName: authName?.trim() || '',
      avatarUri: DEFAULT_PATIENT_AVATAR,
      isHydrated: true,
    });
  },

  setDisplayName: async (name) => {
    const displayName = name.trim();
    const avatarUri = get().avatarUri;
    set({ displayName });
    await persistProfile({ displayName, avatarUri });
  },

  setAvatarUri: async (uri) => {
    const displayName = get().displayName;
    set({ avatarUri: uri });
    await persistProfile({ displayName, avatarUri: uri });
  },
}));
