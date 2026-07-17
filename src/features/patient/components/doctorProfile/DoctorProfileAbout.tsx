import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';

const ABOUT_PREVIEW_LENGTH = 140;

export interface DoctorProfileAboutProps {
  about: string;
}

export function DoctorProfileAbout({ about }: DoctorProfileAboutProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [expanded, setExpanded] = useState(false);

  const isLong = about.length > ABOUT_PREVIEW_LENGTH;
  const text =
    expanded || !isLong ? about : `${about.slice(0, ABOUT_PREVIEW_LENGTH).trimEnd()}…`;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
        {t('patient.aboutDoctor')}
      </Text>
      <Text style={[styles.aboutText, isRTL && styles.rtlText]}>{text}</Text>
      {isLong ? (
        <Pressable onPress={() => setExpanded((prev) => !prev)} hitSlop={6}>
          <Text style={[styles.readMore, isRTL && styles.rtlText]}>
            {expanded ? t('patient.readLess') : t('patient.readMore')}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  aboutText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  readMore: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
