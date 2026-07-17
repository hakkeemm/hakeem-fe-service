import React, { useEffect, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';
import type { TextInputProps } from 'react-native';

import { useRTL } from '../../hooks/useRTL';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { FilterButton, type FilterButtonProps } from './FilterButton';
import { HeaderSearchIcon } from './homeHeaderIcons';
import { homeHeaderColors } from './homeHeaderUtils';
import { SearchButton } from './SearchButton';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CONTROL_HEIGHT = 44;

export interface ExpandableSearchPanelProps extends Omit<TextInputProps, 'style'> {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  filter?: FilterButtonProps;
  accessibilityLabel?: string;
  containerStyle?: ViewStyle;
  tone?: 'default' | 'onPrimary';
}

/**
 * Search control that expands left in-place into a full field.
 * Collapsed = circular icon (same size/alignment as notification).
 * Expanded = pill search field (parent hides greeting).
 */
export function ExpandableSearchPanel({
  expanded,
  onExpandedChange,
  filter,
  accessibilityLabel = 'Search',
  containerStyle,
  tone = 'default',
  ...inputProps
}: ExpandableSearchPanelProps) {
  const { isRTL } = useRTL();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const timerId = setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => clearTimeout(timerId);
  }, [expanded]);

  if (!expanded) {
    return (
      <View style={[styles.collapsedWrap, containerStyle]}>
        <SearchButton
          accessibilityLabel={accessibilityLabel}
          onPress={() => onExpandedChange(true)}
          tone={tone}
        />
      </View>
    );
  }

  return (
    <View style={[styles.expandedWrap, isRTL && styles.expandedWrapRtl, containerStyle]}>
      <HeaderSearchIcon color={colors.textPlaceholder} size={20} />
      <TextInput
        ref={inputRef}
        {...inputProps}
        placeholderTextColor={colors.textPlaceholder}
        style={[styles.input, isRTL ? styles.inputRtl : styles.inputLtr]}
        onBlur={(event) => {
          inputProps.onBlur?.(event);
          onExpandedChange(false);
        }}
      />
      {filter ? (
        <>
          <View style={styles.divider} />
          <FilterButton {...filter} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  collapsedWrap: {
    width: CONTROL_HEIGHT,
    height: CONTROL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedWrap: {
    flex: 1,
    minWidth: 0,
    height: CONTROL_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: homeHeaderColors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingStart: spacing.md,
    paddingEnd: spacing.xs,
    gap: spacing.sm,
  },
  expandedWrapRtl: {
    flexDirection: 'row-reverse',
  },
  input: {
    ...typography.body,
    flex: 1,
    height: CONTROL_HEIGHT,
    paddingVertical: 0,
    margin: 0,
    color: colors.text,
  },
  inputLtr: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  inputRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 22,
    backgroundColor: colors.border,
  },
});
