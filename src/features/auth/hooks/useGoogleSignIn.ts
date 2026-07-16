import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import { getApiErrorMessage } from '../../../shared/api/errors';
import { useGoogleLogin } from './useAuthMutations';

WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const androidClientId =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || webClientId;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || webClientId;

function getGoogleClientIds() {
  return {
    webClientId: webClientId || undefined,
    // Expo Auth Session requires a platform client id on native.
    // Until separate Android/iOS OAuth clients exist, reuse the Web client id.
    ...(Platform.OS === 'android' && androidClientId
      ? { androidClientId }
      : {}),
    ...(Platform.OS === 'ios' && iosClientId ? { iosClientId } : {}),
  };
}

export function useGoogleSignIn() {
  const googleLogin = useGoogleLogin();
  const [error, setError] = useState<string | null>(null);
  const [isPrompting, setIsPrompting] = useState(false);
  const handledResponseRef = useRef<string | null>(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    ...getGoogleClientIds(),
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (!response) {
      return;
    }

    const responseKey = `${response.type}:${JSON.stringify(response.params ?? {})}`;
    if (handledResponseRef.current === responseKey) {
      return;
    }
    handledResponseRef.current = responseKey;

    if (response.type === 'success') {
      const idToken = response.params.id_token;
      if (!idToken) {
        setError('Google sign-in did not return an ID token.');
        setIsPrompting(false);
        return;
      }

      void googleLogin
        .mutateAsync({ idToken })
        .catch((err: unknown) => {
          setError(getApiErrorMessage(err, 'Google sign-in failed.'));
        })
        .finally(() => {
          setIsPrompting(false);
        });
      return;
    }

    if (response.type === 'error') {
      setError(response.error?.message ?? 'Google sign-in failed.');
      setIsPrompting(false);
      return;
    }

    if (response.type === 'dismiss' || response.type === 'cancel') {
      setIsPrompting(false);
    }
  }, [googleLogin, response]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);

    if (!webClientId) {
      setError('Google Client ID is not configured.');
      return;
    }

    if (!request) {
      setError('Google sign-in is not ready yet. Try again.');
      return;
    }

    setIsPrompting(true);
    try {
      await promptAsync();
    } catch (err) {
      setIsPrompting(false);
      setError(getApiErrorMessage(err, 'Google sign-in failed.'));
    }
  }, [promptAsync, request]);

  return {
    signInWithGoogle,
    isReady: Boolean(request),
    isPending: isPrompting || googleLogin.isPending,
    error,
  };
}
