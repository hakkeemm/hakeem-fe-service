import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { HomeScreen } from '../screens/HomeScreen';
import { MyAppointmentsScreen } from '../screens/MyAppointmentsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchResultsListScreen } from '../screens/SearchResultsListScreen';

export type PatientTabParamList = {
  Home: undefined;
  Search: undefined;
  Appointments: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<PatientTabParamList>();

export function PatientTabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('patient.home') }} />
      <Tab.Screen
        name="Search"
        component={SearchResultsListScreen}
        options={{ title: t('patient.search') }}
      />
      <Tab.Screen
        name="Appointments"
        component={MyAppointmentsScreen}
        options={{ title: t('patient.appointments') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('patient.profile') }}
      />
    </Tab.Navigator>
  );
}
