import React from 'react';
import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '../../../shared/components/PlaceholderScreen';

export function MyAppointmentsScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('patient.appointments')} />;
}
