import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRTL } from '../../../shared/hooks/useRTL';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { DOCTOR_CATEGORIES, type SpecialtyId } from '../data/mockCategories';
import { CategoryItem } from './CategoryItem';

export interface SpecialistFilterSheetProps {
  visible: boolean;
  selectedId?: SpecialtyId | null;
  onClose: () => void;
  onSelect: (id: SpecialtyId | null) => void;
}

export function SpecialistFilterSheet({
  visible,
  selectedId,
  onClose,
  onSelect,
}: SpecialistFilterSheetProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text style={[styles.title, isRTL && styles.rtlText]}>
            {t('patient.filterBySpecialist')}
          </Text>

          <FlatList
            data={DOCTOR_CATEGORIES}
            keyExtractor={(item) => item.id}
            numColumns={4}
            style={styles.list}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={[styles.column, isRTL && styles.columnRtl]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CategoryItem
                category={item}
                label={t(`patient.categories.${item.id}`)}
                variant="grid"
                onPress={() => {
                  onSelect(selectedId === item.id ? null : item.id);
                  onClose();
                }}
              />
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    maxHeight: '70%',
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  list: {
    flexGrow: 0,
  },
  grid: {
    paddingBottom: spacing.sm,
  },
  column: {
    justifyContent: 'space-between',
  },
  columnRtl: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    writingDirection: 'rtl',
  },
});
