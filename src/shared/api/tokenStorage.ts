import * as Keychain from 'react-native-keychain';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'hakeem_access_token';
const REFRESH_TOKEN_KEY = 'hakeem_refresh_token';
const KEYCHAIN_SERVICE = 'com.hakeem.app.tokens';

let useSecureStoreFallback = false;

async function setSecureItem(key: string, value: string): Promise<void> {
  if (useSecureStoreFallback) {
    await SecureStore.setItemAsync(key, value);
    return;
  }

  try {
    await Keychain.setGenericPassword(key, value, {
      service: `${KEYCHAIN_SERVICE}.${key}`,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch {
    useSecureStoreFallback = true;
    await SecureStore.setItemAsync(key, value);
  }
}

async function getSecureItem(key: string): Promise<string | null> {
  if (useSecureStoreFallback) {
    return SecureStore.getItemAsync(key);
  }

  try {
    const credentials = await Keychain.getGenericPassword({
      service: `${KEYCHAIN_SERVICE}.${key}`,
    });
    if (!credentials) {
      return null;
    }
    return credentials.password;
  } catch {
    useSecureStoreFallback = true;
    return SecureStore.getItemAsync(key);
  }
}

async function deleteSecureItem(key: string): Promise<void> {
  if (useSecureStoreFallback) {
    await SecureStore.deleteItemAsync(key);
    return;
  }

  try {
    await Keychain.resetGenericPassword({
      service: `${KEYCHAIN_SERVICE}.${key}`,
    });
  } catch {
    useSecureStoreFallback = true;
    await SecureStore.deleteItemAsync(key);
  }
}

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([
    setSecureItem(ACCESS_TOKEN_KEY, accessToken),
    setSecureItem(REFRESH_TOKEN_KEY, refreshToken),
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return getSecureItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return getSecureItem(REFRESH_TOKEN_KEY);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([deleteSecureItem(ACCESS_TOKEN_KEY), deleteSecureItem(REFRESH_TOKEN_KEY)]);
}
