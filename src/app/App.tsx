import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { applyRtl, getDeviceDefaultLanguage, initI18n, type AppLanguage } from '../shared/i18n';
import { LoadingSpinner } from '../shared/components/LoadingSpinner';
import { initPushNotifications } from '../shared/api/pushNotifications';
import { LANGUAGE_STORAGE_KEY, useLanguageStore } from '../shared/store/languageStore';
import { RootNavigator } from './RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  const [ready, setReady] = useState(false);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const setLanguageHydrated = useLanguageStore((state) => state.setHydrated);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap(): Promise<void> {
      const stored = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);
      const language: AppLanguage =
        stored === 'ar' || stored === 'en' ? stored : getDeviceDefaultLanguage();

      await applyRtl(language);
      initI18n(language);
      setLanguage(language);
      setLanguageHydrated(true);

      await initPushNotifications();

      if (!cancelled) {
        setReady(true);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [setLanguage, setLanguageHydrated]);

  if (!ready) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <LoadingSpinner />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
