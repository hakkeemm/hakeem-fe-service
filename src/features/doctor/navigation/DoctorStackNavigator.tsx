import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppointmentDetailScreen } from '../screens/AppointmentDetailScreen';
import { DoctorTabNavigator } from './DoctorTabNavigator';

export type DoctorStackParamList = {
  DoctorTabs: undefined;
  AppointmentDetail: undefined;
};

const Stack = createNativeStackNavigator<DoctorStackParamList>();

export function DoctorStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DoctorTabs"
        component={DoctorTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
    </Stack.Navigator>
  );
}
