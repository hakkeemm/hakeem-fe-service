import React from 'react';
import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '../../../shared/components/PlaceholderScreen';

export function LiveQueueScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('assistant.liveQueue')} showLogout />;
}
