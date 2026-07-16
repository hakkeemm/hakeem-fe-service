import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { LanguageSelectScreen } from '../screens/LanguageSelectScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { VerifyEmailScreen } from '../screens/VerifyEmailScreen';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  VerifyEmail: { email: string };
  ForgotPassword: undefined;
  ResetPassword: undefined;
  LanguageSelect: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
    </Stack.Navigator>
  );
}
