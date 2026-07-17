import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { AppBottomNav, type AppBottomNavItemConfig } from '../../../shared/components/AppBottomNav';
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

  const items = useMemo<AppBottomNavItemConfig[]>(
    () => [
      { routeName: 'Home', label: t('patient.home'), icon: 'home' },
      { routeName: 'Search', label: t('patient.doctor'), icon: 'doctor' },
      { routeName: 'Appointments', label: t('patient.appointment'), icon: 'calendar' },
      { routeName: 'Profile', label: t('patient.profile'), icon: 'profile' },
    ],
    [t],
  );

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <AppBottomNav
          {...props}
          items={items}
          centerAction={{
            accessibilityLabel: t('patient.quickAction'),
            onPress: () => {
              props.navigation.navigate('Search');
            },
          }}
        />
      )}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchResultsListScreen} />
      <Tab.Screen name="Appointments" component={MyAppointmentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
