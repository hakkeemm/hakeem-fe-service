import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { AppointmentTimelineScreen } from '../screens/AppointmentTimelineScreen';
import { DoctorHomeScreen } from '../screens/DoctorHomeScreen';
import { DoctorProfileEditScreen } from '../screens/DoctorProfileEditScreen';
import { FeedbackInboxScreen } from '../screens/FeedbackInboxScreen';
import { ScheduleBuilderScreen } from '../screens/ScheduleBuilderScreen';

export type DoctorTabParamList = {
  Home: undefined;
  Schedule: undefined;
  Timeline: undefined;
  Feedback: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<DoctorTabParamList>();

export function DoctorTabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={DoctorHomeScreen} options={{ title: t('doctor.home') }} />
      <Tab.Screen
        name="Schedule"
        component={ScheduleBuilderScreen}
        options={{ title: t('doctor.schedule') }}
      />
      <Tab.Screen
        name="Timeline"
        component={AppointmentTimelineScreen}
        options={{ title: t('doctor.timeline') }}
      />
      <Tab.Screen
        name="Feedback"
        component={FeedbackInboxScreen}
        options={{ title: t('doctor.feedback') }}
      />
      <Tab.Screen
        name="Profile"
        component={DoctorProfileEditScreen}
        options={{ title: t('doctor.profile') }}
      />
    </Tab.Navigator>
  );
}
