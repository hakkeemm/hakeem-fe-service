import React from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ExpandableSearchPanel } from '../../../shared/components/homeHeader';
import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ANIMATION_MS = 300;

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

export interface DoctorScreenHeaderProps {
  title: string;
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

  const setSearchExpanded = (expanded: boolean) => {
    configureHeaderAnimation();
    onSearchExpandedChange(expanded);
  };

  return (
    <View style={[styles.header, isRTL && styles.headerRtl]}>
      {onBackPress ? (
        <Pressable
          onPress={onBackPress}
          accessibilityRole="button"
          accessibilityLabel={backAccessibilityLabel}
          style={styles.iconButton}
          hitSlop={8}
        >
          <View style={isRTL ? styles.backIconRtl : undefined}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
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
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
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
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  iconSpacer: {
    width: 44,
    height: 44,
  },
  backIconRtl: {
    transform: [{ scaleX: -1 }],
  },
});
