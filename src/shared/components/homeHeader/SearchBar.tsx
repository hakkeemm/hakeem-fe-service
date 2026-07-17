import React from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { useRTL } from '../../hooks/useRTL';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { HeaderSearchIcon } from './homeHeaderIcons';
import { homeHeaderColors } from './homeHeaderUtils';

export interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  /** Trailing action (e.g. FilterButton). Shown after a divider. */
  endAdornment?: React.ReactNode;
  /** When set, the whole bar acts as a button (useful for navigate-to-search). */
  onPressContainer?: () => void;
  containerStyle?: ViewStyle;
}

export const SearchBar = React.forwardRef<TextInput, SearchBarProps>(function SearchBar(
  {
    endAdornment,
    onPressContainer,
    containerStyle,
    editable = true,
    ...inputProps
  },
  ref,
) {
  const { isRTL } = useRTL();
  const isInteractiveShell = Boolean(onPressContainer) && !editable;

  const content = (
    <>
      <View style={styles.iconWrap}>
        <HeaderSearchIcon color={colors.textPlaceholder} size={20} />
      </View>
      <TextInput
        ref={ref}
        {...inputProps}
        editable={editable && !isInteractiveShell}
        pointerEvents={isInteractiveShell ? 'none' : 'auto'}
        placeholderTextColor={colors.textPlaceholder}
        style={[styles.input, isRTL ? styles.inputRtl : styles.inputLtr]}
      />
      {endAdornment ? (
        <>
          <View style={styles.divider} />
          {endAdornment}
        </>
      ) : null}
    </>
  );

  const containerStyles = [
    styles.container,
    isRTL && styles.containerRtl,
    containerStyle,
  ];

  if (isInteractiveShell) {
    return (
      <Pressable
        onPress={onPressContainer}
        style={({ pressed }) => [...containerStyles, pressed && styles.pressed]}
        accessibilityRole="search"
      >
        {content}
      </Pressable>
    );
  }

  return <View style={containerStyles}>{content}</View>;
});

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: homeHeaderColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: spacing.lg,
    paddingEnd: spacing.xs,
    gap: spacing.sm,
  },
  containerRtl: {
    flexDirection: 'row-reverse',
  },
  iconWrap: {
    paddingEnd: spacing.xs,
  },
  pressed: {
    opacity: 0.92,
  },
  input: {
    ...typography.body,
    flex: 1,
    minHeight: 48,
    paddingVertical: 0,
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
    alignSelf: 'stretch',
    marginVertical: spacing.sm,
    backgroundColor: colors.border,
  },
});
