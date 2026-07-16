import React, { useEffect, useRef } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const OTP_LENGTH = 6;
const EMPTY_PLACEHOLDER = '-';

interface OtpInputProps {
  value: string;
  onChange: (code: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
  style?: ViewStyle;
}

export function OtpInput({
  value,
  onChange,
  length = OTP_LENGTH,
  disabled = false,
  autoFocus = true,
  error = false,
  style,
}: OtpInputProps) {
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  useEffect(() => {
    if (autoFocus && !disabled) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus, disabled]);

  const focusIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(length - 1, index));
    inputsRef.current[clamped]?.focus();
  };

  const updateDigit = (index: number, nextDigit: string) => {
    const chars = value.padEnd(length, ' ').slice(0, length).split('');
    chars[index] = nextDigit;
    const next = chars.join('').replace(/ /g, '').slice(0, length);
    onChange(next);

    if (nextDigit && index < length - 1) {
      focusIndex(index + 1);
    }
  };

  const handleChange = (index: number, text: string) => {
    const cleaned = text.replace(/\D/g, '');

    if (cleaned.length === 0) {
      updateDigit(index, '');
      return;
    }

    // Paste / autofill of multiple digits
    if (cleaned.length > 1) {
      const merged = (value.slice(0, index) + cleaned).replace(/\D/g, '').slice(0, length);
      onChange(merged);
      focusIndex(Math.min(merged.length, length - 1));
      return;
    }

    updateDigit(index, cleaned);
  };

  const handleKeyPress = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (event.nativeEvent.key !== 'Backspace') {
      return;
    }

    if (value[index]) {
      updateDigit(index, '');
      return;
    }

    if (index > 0) {
      updateDigit(index - 1, '');
      focusIndex(index - 1);
    }
  };

  return (
    <View style={[styles.row, style]} accessibilityRole="none">
      {Array.from({ length }, (_, index) => {
        const digit = digits[index]?.trim() ?? '';

        return (
          <View
            key={`otp-${index}`}
            style={[styles.cell, error && styles.cellError, disabled && styles.cellDisabled]}
          >
            <TextInput
              ref={(ref) => {
                inputsRef.current[index] = ref;
              }}
              value={digit}
              onChangeText={(text) => handleChange(index, text)}
              onKeyPress={(event) => handleKeyPress(index, event)}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              maxLength={length}
              editable={!disabled}
              selectTextOnFocus
              placeholder={EMPTY_PLACEHOLDER}
              placeholderTextColor={colors.textPlaceholder}
              style={styles.input}
              caretHidden
              accessibilityLabel={`Digit ${index + 1} of ${length}`}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  cell: {
    flex: 1,
    maxWidth: 52,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cellError: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  cellDisabled: {
    opacity: 0.55,
  },
  input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    padding: 0,
  },
});
