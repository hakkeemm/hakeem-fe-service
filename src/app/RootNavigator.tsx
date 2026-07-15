import React from 'react';

import { useAuthSession } from '../shared/hooks/useAuthSession';
import { LoadingSpinner } from '../shared/components/LoadingSpinner';
import { AuthNavigator } from '../features/auth/navigation/AuthNavigator';
import { PatientStackNavigator } from '../features/patient/navigation/PatientStackNavigator';
import { DoctorStackNavigator } from '../features/doctor/navigation/DoctorStackNavigator';
import { AssistantTabNavigator } from '../features/assistant/navigation/AssistantTabNavigator';

export function RootNavigator() {
  const { isAuthenticated, isRestoring, role } = useAuthSession();

  if (isRestoring) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !role) {
    return <AuthNavigator />;
  }

  switch (role) {
    case 'patient':
      return <PatientStackNavigator />;
    case 'doctor':
      return <DoctorStackNavigator />;
    case 'assistant':
      return <AssistantTabNavigator />;
    default:
      return <AuthNavigator />;
  }
}
