/**
 * Push notification wiring stub.
 *
 * TODO: Configure Firebase for Expo Dev Client / bare builds, then:
 * 1. Request notification permissions
 * 2. Get FCM token via @react-native-firebase/messaging
 * 3. Register token with backend
 * 4. Handle foreground / background / quit notification states
 */

export async function initPushNotifications(): Promise<void> {
  // Intentionally no-op until Firebase project credentials are configured.
}

export async function getPushToken(): Promise<string | null> {
  // TODO: return FCM device token
  return null;
}
