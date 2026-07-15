import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';

import { getAccessToken } from './tokenStorage';

const HUB_URL = process.env.EXPO_PUBLIC_SIGNALR_HUB_URL ?? 'https://api.example.com/hubs/hakeem';

let connection: HubConnection | null = null;

export function getSignalRConnection(): HubConnection | null {
  return connection;
}

export async function startSignalRConnection(): Promise<HubConnection | null> {
  if (connection?.state === HubConnectionState.Connected) {
    return connection;
  }

  // Scaffold: skip real socket when using mock auth / placeholder hub
  if (process.env.EXPO_PUBLIC_USE_MOCK_AUTH !== 'false') {
    return null;
  }

  connection = new HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: async () => (await getAccessToken()) ?? '',
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  await connection.start();
  return connection;
}

export async function stopSignalRConnection(): Promise<void> {
  if (!connection) {
    return;
  }

  try {
    if (connection.state !== HubConnectionState.Disconnected) {
      await connection.stop();
    }
  } finally {
    connection = null;
  }
}

/** Patient screens: subscribe to slot availability (wire handlers when APIs exist). */
export function subscribeToSlotAvailability(
  handler: (payload: unknown) => void,
): (() => void) | undefined {
  const hub = getSignalRConnection();
  if (!hub) {
    return undefined;
  }
  hub.on('SlotAvailabilityUpdated', handler);
  return () => hub.off('SlotAvailabilityUpdated', handler);
}

/** Assistant screens: subscribe to live queue updates. */
export function subscribeToQueueUpdates(
  handler: (payload: unknown) => void,
): (() => void) | undefined {
  const hub = getSignalRConnection();
  if (!hub) {
    return undefined;
  }
  hub.on('QueueUpdated', handler);
  return () => hub.off('QueueUpdated', handler);
}
