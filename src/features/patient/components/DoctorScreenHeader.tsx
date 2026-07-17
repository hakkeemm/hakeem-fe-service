import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CURVE_DEPTH,
  CurvedHeaderBackground,
  ExpandableSearchPanel,
} from '../../../shared/components/homeHeader';
import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ANIMATION_MS = 300;
/** Vertical padding inside curved header content (top + bottom). */
const CONTENT_VERTICAL_PADDING = spacing.md + spacing.lg;

function configureHeaderAnimation() {
  LayoutAnimation.configureNext({
    duration: ANIMATION_MS,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  });
}

export interface DoctorHeaderHeights {
  max: number;
  min: number;
  collapseDistance: number;
}

export interface DoctorScreenHeaderProps {
  title: string;
  encouragementTitle: string;
  encouragementMessage: string;
  /** Current list scroll offset — collapses encouragement inside the curve. */
  scrollOffset: number;
  onHeightsChange?: (heights: DoctorHeaderHeights) => void;
  onBackPress?: () => void;
  onFilterPress?: () => void;
  backAccessibilityLabel: string;
  filterAccessibilityLabel: string;
  searchAccessibilityLabel: string;
  searchPlaceholder: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  isSearchExpanded: boolean;
  onSearchExpandedChange: (expanded: boolean) => void;
}

export function DoctorScreenHeader({
  title,
  encouragementTitle,
  encouragementMessage,
  scrollOffset,
  onHeightsChange,
  onBackPress,
  onFilterPress,
  backAccessibilityLabel,
  filterAccessibilityLabel,
  searchAccessibilityLabel,
  searchPlaceholder,
  searchQuery,
  onSearchQueryChange,
  isSearchExpanded,
  onSearchExpandedChange,
}: DoctorScreenHeaderProps) {
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const [stickyHeight, setStickyHeight] = useState(0);
  const [encouragementFullHeight, setEncouragementFullHeight] = useState(0);
  const reportedKey = useRef('');

  const setSearchExpanded = (expanded: boolean) => {
    configureHeaderAnimation();
    onSearchExpandedChange(expanded);
  };

  const collapseDistance = encouragementFullHeight;
  const visibleEncouragementHeight = Math.max(
    0,
    encouragementFullHeight - Math.max(0, scrollOffset),
  );
  const collapseProgress =
    collapseDistance > 0 ? 1 - visibleEncouragementHeight / collapseDistance : 1;

  useEffect(() => {
    if (!onHeightsChange || stickyHeight <= 0) {
      return;
    }

    const contentMin = stickyHeight + CONTENT_VERTICAL_PADDING;
    const contentMax = contentMin + encouragementFullHeight;
    const min = insets.top + contentMin + CURVE_DEPTH;
    const max = insets.top + contentMax + CURVE_DEPTH;
    const key = `${min}:${max}:${encouragementFullHeight}`;

    if (key === reportedKey.current) {
      return;
    }

    reportedKey.current = key;
    onHeightsChange({
      max,
      min,
      collapseDistance: encouragementFullHeight,
    });
  }, [encouragementFullHeight, insets.top, onHeightsChange, stickyHeight]);

  return (
    <View style={styles.sticky} pointerEvents="box-none">
      <CurvedHeaderBackground color={colors.primary}>
        <View
          style={[styles.topRow, isRTL && styles.topRowRtl]}
          onLayout={(event) => {
            const next = event.nativeEvent.layout.height;
            if (next > 0 && Math.abs(next - stickyHeight) > 1) {
              setStickyHeight(next);
            }
          }}
        >
          {onBackPress ? (
            <Pressable
              onPress={onBackPress}
              accessibilityRole="button"
              accessibilityLabel={backAccessibilityLabel}
              style={styles.iconButton}
              hitSlop={8}
            >
              <View style={isRTL ? styles.backIconRtl : undefined}>
                <Ionicons name="chevron-back" size={22} color={colors.background} />
              </View>
            </Pressable>
          ) : (
            <View style={styles.iconSpacer} />
          )}

          {!isSearchExpanded ? <Text style={styles.title}>{title}</Text> : null}

          <View style={[styles.searchWrap, isSearchExpanded && styles.searchWrapExpanded]}>
            <ExpandableSearchPanel
              expanded={isSearchExpanded}
              onExpandedChange={setSearchExpanded}
              tone="onPrimary"
              accessibilityLabel={searchAccessibilityLabel}
              value={searchQuery}
              onChangeText={onSearchQueryChange}
              placeholder={searchPlaceholder}
              returnKeyType="search"
              filter={{
                accessibilityLabel: filterAccessibilityLabel,
                onPress: onFilterPress,
              }}
            />
          </View>
        </View>

        <View
          style={[
            styles.encouragementClip,
            encouragementFullHeight > 0
              ? {
                  height: visibleEncouragementHeight,
                  opacity: 1 - collapseProgress * 0.85,
                }
              : null,
          ]}
        >
          <View
            style={styles.encouragementMeasure}
            onLayout={(event) => {
              const next = event.nativeEvent.layout.height;
              if (next > 0 && (encouragementFullHeight === 0 || next > encouragementFullHeight + 1)) {
                setEncouragementFullHeight(next);
              }
            }}
          >
            <Text style={[styles.encouragementTitle, isRTL && styles.rtlText]}>
              {encouragementTitle}
            </Text>
            <Text style={[styles.encouragementMessage, isRTL && styles.rtlText]}>
              {encouragementMessage}
            </Text>
          </View>
        </View>
      </CurvedHeaderBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  sticky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    minHeight: 44,
  },
  topRowRtl: {
    flexDirection: 'row-reverse',
  },
  title: {
    ...typography.subtitle,
    color: colors.background,
    flex: 1,
    textAlign: 'center',
  },
  searchWrap: {
    flexShrink: 0,
  },
  searchWrapExpanded: {
    flex: 1,
    minWidth: 0,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacer: {
    width: 44,
    height: 44,
  },
  backIconRtl: {
    transform: [{ scaleX: -1 }],
  },
  encouragementClip: {
    overflow: 'hidden',
  },
  encouragementMeasure: {
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  encouragementTitle: {
    ...typography.subtitle,
    color: colors.background,
  },
  encouragementMessage: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.85)',
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
