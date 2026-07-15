import React from 'react';
import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '../../../shared/components/PlaceholderScreen';

export function DoctorProfileEditScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('doctor.profile')} showLogout />;
}
