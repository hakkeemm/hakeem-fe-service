import React from 'react';

import { NotificationsCenterScreen as SharedNotificationsCenterScreen } from '../../../shared/screens/NotificationsCenterScreen';

/** Patient entry point — reuse shared notifications center. */
export function NotificationsCenterScreen() {
  return <SharedNotificationsCenterScreen />;
}
