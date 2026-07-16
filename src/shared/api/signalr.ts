import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';

import { getAccessToken } from './tokenStorage';

const HUB_URL = process.env.EXPO_PUBLIC_SIGNALR_HUB_URL ?? '';
const SIGNALR_ENABLED = process.env.EXPO_PUBLIC_SIGNALR_ENABLED === 'true';

let connection: HubConnection | null = null;

export function getSignalRConnection(): HubConnection | null {
  return connection;
}

export async function startSignalRConnection(): Promise<HubConnection | null> {
  // Backend has no SignalR hub yet — skip until explicitly enabled.
  if (!SIGNALR_ENABLED || !HUB_URL) {
    return null;
  }

  if (connection?.state === HubConnectionState.Connected) {
    return connection;
  }

  try {
    connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: async () => (await getAccessToken()) ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.None)
      .build();

    await connection.start();
    return connection;
  } catch {
    connection = null;
    return null;
  }
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
