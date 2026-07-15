import React from 'react';
import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '../../../shared/components/PlaceholderScreen';

export function ProfileScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('patient.profile')} showLogout />;
}
