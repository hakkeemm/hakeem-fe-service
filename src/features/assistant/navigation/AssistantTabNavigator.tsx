import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { LiveQueueScreen } from '../screens/LiveQueueScreen';
import { ManualEntryScreen } from '../screens/ManualEntryScreen';
import { QueueHistoryScreen } from '../screens/QueueHistoryScreen';

export type AssistantTabParamList = {
  LiveQueue: undefined;
  ManualEntry: undefined;
  History: undefined;
};

const Tab = createBottomTabNavigator<AssistantTabParamList>();

export function AssistantTabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="LiveQueue"
        component={LiveQueueScreen}
        options={{ title: t('assistant.liveQueue') }}
      />
      <Tab.Screen
        name="ManualEntry"
        component={ManualEntryScreen}
        options={{ title: t('assistant.manualEntry') }}
      />
      <Tab.Screen
        name="History"
        component={QueueHistoryScreen}
        options={{ title: t('assistant.history') }}
      />
    </Tab.Navigator>
  );
}
