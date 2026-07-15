import React, { PropsWithChildren } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Button } from './Button';

interface ModalProps extends PropsWithChildren {
  visible: boolean;
  title?: string;
  onClose: () => void;
  primaryLabel?: string;
  onPrimaryPress?: () => void;
}

export function Modal({
  visible,
  title,
  onClose,
  children,
  primaryLabel,
  onPrimaryPress,
}: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <View style={styles.body}>{children}</View>
          <View style={styles.actions}>
            <Button label="Cancel" variant="ghost" onPress={onClose} style={styles.action} />
            {primaryLabel && onPrimaryPress ? (
              <Button label={primaryLabel} onPress={onPrimaryPress} style={styles.action} />
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
  },
  body: {
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
  },
});
