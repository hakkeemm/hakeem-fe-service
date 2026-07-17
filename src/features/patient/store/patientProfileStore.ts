import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const PATIENT_PROFILE_STORAGE_PREFIX = 'hakeem_patient_profile_';

type StoredPatientProfile = {
  /** Optional local override; empty/missing means use auth FullName. */
  displayName?: string;
  /** Optional local photo URI; empty/missing means show initials. */
  avatarUri?: string;
};

interface PatientProfileState {
  userId: string | null;
  /** Resolved name shown in UI (auth name or local override). */
  displayName: string;
  /** Local photo URI, or empty string for initials fallback. */
  avatarUri: string;
  isHydrated: boolean;
  hydrateFromAuthUser: (user: { id: string; name: string } | null | undefined) => Promise<void>;
  setDisplayName: (name: string) => Promise<void>;
  setAvatarUri: (uri: string) => Promise<void>;
  clear: () => void;
}

function storageKey(userId: string): string {
  return `${PATIENT_PROFILE_STORAGE_PREFIX}${userId}`;
}

async function readStoredProfile(userId: string): Promise<StoredPatientProfile | null> {
  try {
    const raw = await SecureStore.getItemAsync(storageKey(userId));
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StoredPatientProfile;
  } catch {
    return null;
  }
}

async function writeStoredProfile(userId: string, profile: StoredPatientProfile): Promise<void> {
  await SecureStore.setItemAsync(storageKey(userId), JSON.stringify(profile));
}

function resolveDisplayName(authName: string, override?: string): string {
  const local = override?.trim();
  if (local) {
    return local;
  }
  return authName.trim();
}

export const usePatientProfileStore = create<PatientProfileState>((set, get) => ({
  userId: null,
  displayName: '',
  avatarUri: '',
  isHydrated: false,

  hydrateFromAuthUser: async (user) => {
    if (!user?.id) {
      set({
        userId: null,
        displayName: '',
        avatarUri: '',
        isHydrated: true,
      });
      return;
    }

    const authName = user.name?.trim() || '';
    const stored = await readStoredProfile(user.id);
    const displayName = resolveDisplayName(authName, stored?.displayName);
    const avatarUri = stored?.avatarUri?.trim() || '';

    set({
      userId: user.id,
      displayName,
      avatarUri,
      isHydrated: true,
    });
  },

  setDisplayName: async (name) => {
    const userId = get().userId;
    if (!userId) {
      return;
    }

    const displayName = name.trim();
    const avatarUri = get().avatarUri;
    set({ displayName });
    await writeStoredProfile(userId, {
      displayName,
      avatarUri: avatarUri || undefined,
    });
  },

  setAvatarUri: async (uri) => {
    const userId = get().userId;
    if (!userId) {
      return;
    }

    const displayName = get().displayName;
    const avatarUri = uri.trim();
    set({ avatarUri });
    await writeStoredProfile(userId, {
      displayName: displayName || undefined,
      avatarUri: avatarUri || undefined,
    });
  },

  clear: () => {
    set({
      userId: null,
      displayName: '',
      avatarUri: '',
      isHydrated: false,
    });
  },
}));
