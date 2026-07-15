import React from 'react';
import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '../../../shared/components/PlaceholderScreen';

export function QueueHistoryScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('assistant.history')} />;
}
