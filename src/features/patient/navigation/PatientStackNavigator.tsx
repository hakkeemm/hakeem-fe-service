import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppointmentDetailScreen } from '../screens/AppointmentDetailScreen';
import { BookingConfirmScreen } from '../screens/BookingConfirmScreen';
import { BookingSuccessScreen } from '../screens/BookingSuccessScreen';
import { DoctorProfileScreen } from '../screens/DoctorProfileScreen';
import { FilterScreen } from '../screens/FilterScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { RateReviewScreen } from '../screens/RateReviewScreen';
import { SearchResultsListScreen } from '../screens/SearchResultsListScreen';
import { SearchResultsMapScreen } from '../screens/SearchResultsMapScreen';
import { SlotPickerScreen } from '../screens/SlotPickerScreen';
import { PatientTabNavigator } from './PatientTabNavigator';

export type PatientStackParamList = {
  PatientTabs: undefined;
  SearchResultsList: undefined;
  SearchResultsMap: undefined;
  Filter: undefined;
  DoctorProfile: undefined;
  SlotPicker: undefined;
  BookingConfirm: undefined;
  Payment: undefined;
  BookingSuccess: undefined;
  AppointmentDetail: undefined;
  RateReview: undefined;
};

const Stack = createNativeStackNavigator<PatientStackParamList>();

export function PatientStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PatientTabs"
        component={PatientTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SearchResultsList" component={SearchResultsListScreen} />
      <Stack.Screen name="SearchResultsMap" component={SearchResultsMapScreen} />
      <Stack.Screen name="Filter" component={FilterScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="SlotPicker" component={SlotPickerScreen} />
      <Stack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
      <Stack.Screen name="RateReview" component={RateReviewScreen} />
    </Stack.Navigator>
  );
}
