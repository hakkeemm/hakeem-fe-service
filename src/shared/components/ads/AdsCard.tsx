import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from 'react-native';

import { useRTL } from '../../hooks/useRTL';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AdsCardMedia } from './AdsCardMedia';
import type { AdsSlide } from './adsTypes';

const DEFAULT_BG = '#148F8A';
const CARD_HEIGHT = 168;

export interface AdsCardProps {
  slide: AdsSlide;
  isActive?: boolean;
  width?: number;
  connectLabel: string;
  onConnect?: (slide: AdsSlide) => void;
  style?: ViewStyle;
}

export function AdsCard({
  slide,
  isActive = true,
  width,
  connectLabel,
  onConnect,
  style,
}: AdsCardProps) {
  const { isRTL } = useRTL();
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = width ?? windowWidth - spacing.lg * 2;

  return (
    <View
      style={[
        styles.card,
        { width: cardWidth, backgroundColor: slide.backgroundColor ?? DEFAULT_BG },
        style,
      ]}
    >
      <View style={[styles.content, isRTL && styles.contentRtl]}>
        <View style={styles.copy}>
          <Text style={[styles.title, isRTL && styles.rtlText]} numberOfLines={3}>
            {slide.title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={connectLabel}
            onPress={() => onConnect?.(slide)}
            style={({ pressed }) => [
              styles.connectButton,
              isRTL && styles.connectButtonRtl,
              pressed && styles.connectPressed,
            ]}
          >
            <Text style={styles.connectLabel}>{slide.buttonLabel ?? connectLabel}</Text>
          </Pressable>
        </View>

        <View style={styles.mediaPane}>
          <AdsCardMedia media={slide.media} isActive={isActive} />
        </View>
      </View>
    </View>
  );
}

export const ADS_CARD_HEIGHT = CARD_HEIGHT;

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    borderRadius: 22,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  contentRtl: {
    flexDirection: 'row-reverse',
  },
  copy: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    gap: spacing.md,
    zIndex: 2,
  },
  title: {
    ...typography.subtitle,
    color: colors.surface,
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 26,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  connectButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 36,
    justifyContent: 'center',
  },
  connectButtonRtl: {
    alignSelf: 'flex-end',
  },
  connectPressed: {
    opacity: 0.88,
  },
  connectLabel: {
    ...typography.label,
    color: colors.text,
    fontWeight: '700',
  },
  mediaPane: {
    width: '46%',
    height: '100%',
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
});
