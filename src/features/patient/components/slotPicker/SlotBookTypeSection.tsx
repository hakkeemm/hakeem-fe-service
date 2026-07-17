import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import type { VisitPurpose, VisitType } from '../../data/mockDoctorSchedule';

export interface SlotBookTypeSectionProps {
  visitType: VisitType | null;
  purpose: VisitPurpose | null;
  onSelectVisitType: (value: VisitType) => void;
  onSelectPurpose: (value: VisitPurpose) => void;
}

function OptionPickerField<T extends string>({
  label,
  placeholder,
  value,
  options,
  onChange,
  icon,
  isRTL,
  cancelLabel,
}: {
  label: string;
  placeholder: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  isRTL: boolean;
  cancelLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  const fieldLabel = selected?.label ?? placeholder;

  return (
    <View style={styles.group}>
      <Text style={[styles.groupLabel, isRTL && styles.rtlText]}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[styles.field, isRTL && styles.fieldRtl]}
      >
        <Text style={[styles.fieldText, !selected && styles.placeholder]} numberOfLines={1}>
          {fieldLabel}
        </Text>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <Text style={[styles.sheetTitle, isRTL && styles.rtlText]}>{label}</Text>
            <View style={styles.options}>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                      isRTL && styles.optionRtl,
                    ]}
                  >
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable onPress={() => setOpen(false)} style={styles.closeButton}>
              <Text style={styles.closeLabel}>{cancelLabel}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export function SlotBookTypeSection({
  visitType,
  purpose,
  onSelectVisitType,
  onSelectPurpose,
}: SlotBookTypeSectionProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
        {t('patient.slotSelectBookType')}
      </Text>

      <OptionPickerField
        label={t('patient.slotVisitType')}
        placeholder={t('patient.slotVisitType')}
        value={visitType}
        onChange={onSelectVisitType}
        icon="business-outline"
        isRTL={isRTL}
        cancelLabel={t('common.cancel')}
        options={[
          { value: 'clinic', label: t('patient.slotVisitClinic') },
          { value: 'online', label: t('patient.slotVisitOnline') },
        ]}
      />

      <OptionPickerField
        label={t('patient.slotPurpose')}
        placeholder={t('patient.slotPurpose')}
        value={purpose}
        onChange={onSelectPurpose}
        icon="medkit-outline"
        isRTL={isRTL}
        cancelLabel={t('common.cancel')}
        options={[
          { value: 'first', label: t('patient.slotPurposeFirst') },
          { value: 'followUp', label: t('patient.slotPurposeFollowUp') },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text,
  },
  group: {
    gap: spacing.sm,
  },
  groupLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  fieldRtl: {
    flexDirection: 'row-reverse',
  },
  fieldText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  placeholder: {
    color: colors.textPlaceholder,
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
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  optionRtl: {
    flexDirection: 'row-reverse',
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionLabel: {
    ...typography.label,
    color: colors.primaryDark,
  },
  optionLabelSelected: {
    color: colors.surface,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  closeLabel: {
    ...typography.label,
    color: colors.primary,
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
