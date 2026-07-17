import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../../../../shared/components/Button';
import { getInitials } from '../../../../shared/components/homeHeader';
import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';

export interface PatientProfileIdentityProps {
  displayName: string;
  email?: string;
  avatarUri?: string | null;
  onChangePhoto: () => void;
  onSaveName: (name: string) => void;
}

export function PatientProfileIdentity({
  displayName,
  email,
  avatarUri,
  onChangePhoto,
  onSaveName,
}: PatientProfileIdentityProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayName);
  const hasPhoto = Boolean(avatarUri?.trim());
  const label = displayName || t('patient.profile');

  const openEditor = () => {
    setDraft(displayName);
    setEditing(true);
  };

  const save = () => {
    const next = draft.trim();
    if (next) {
      onSaveName(next);
    }
    setEditing(false);
  };

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onChangePhoto}
        accessibilityRole="button"
        accessibilityLabel={t('patient.changePhoto')}
        style={styles.avatarWrap}
      >
        {hasPhoto ? (
          <Image source={{ uri: avatarUri! }} style={styles.avatar} accessibilityLabel={label} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]} accessibilityLabel={label}>
            <Text style={styles.avatarInitials}>{getInitials(label)}</Text>
          </View>
        )}
        <View style={styles.cameraBadge}>
          <Ionicons name="camera" size={14} color={colors.surface} />
        </View>
      </Pressable>

      <View style={[styles.nameRow, isRTL && styles.rowReverse]}>
        <Text style={styles.name} numberOfLines={1}>
          {label}
        </Text>
        <Pressable
          onPress={openEditor}
          accessibilityRole="button"
          accessibilityLabel={t('patient.editName')}
          hitSlop={8}
          style={styles.editButton}
        >
          <Ionicons name="pencil" size={15} color={colors.primary} />
        </Pressable>
      </View>

      {email ? (
        <Text style={[styles.email, isRTL && styles.rtlText]} numberOfLines={1}>
          {email}
        </Text>
      ) : null}

      <Modal transparent visible={editing} animationType="fade" onRequestClose={() => setEditing(false)}>
        <Pressable style={styles.overlay} onPress={() => setEditing(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <Text style={[styles.sheetTitle, isRTL && styles.rtlText]}>{t('patient.editName')}</Text>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              autoFocus
              style={[styles.input, isRTL ? styles.inputRtl : styles.inputLtr]}
              placeholderTextColor={colors.textPlaceholder}
            />
            <Button label={t('patient.saveName')} onPress={save} />
            <Button label={t('common.cancel')} variant="ghost" onPress={() => setEditing(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarWrap: {
    marginBottom: spacing.xs,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    ...typography.title,
    fontSize: 28,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: '100%',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  name: {
    ...typography.title,
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
    flexShrink: 1,
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  email: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sheetTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
  input: {
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    color: colors.text,
  },
  inputLtr: {
    textAlign: 'left',
  },
  inputRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
