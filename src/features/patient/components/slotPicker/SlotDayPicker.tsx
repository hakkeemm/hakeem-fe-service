import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useRTL } from '../../../../shared/hooks/useRTL';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import type { MockDoctorSchedule } from '../../data/mockDoctorSchedule';
import {
  isDateInBookingRange,
  isWorkingDate,
  listBookingMonths,
} from '../../data/mockDoctorSchedule';

export interface SlotDayPickerProps {
  schedule: MockDoctorSchedule;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

function formatSelectedLabel(dateIso: string, locale: string): string {
  const date = new Date(`${dateIso}T12:00:00`);
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function buildCalendarCells(
  year: number,
  month: number,
  rangeStart: string,
  rangeEnd: string,
): Array<{ date: string | null; inRange: boolean }> {
  const first = new Date(year, month, 1, 12);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startPad = first.getDay();
  const cells: Array<{ date: string | null; inRange: boolean }> = [];

  for (let i = 0; i < startPad; i += 1) {
    cells.push({ date: null, inRange: false });
  }

  for (let day = 1; day <= lastDay; day += 1) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const inRange = isDateInBookingRange(iso, rangeStart, rangeEnd);
    cells.push({ date: iso, inRange });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, inRange: false });
  }

  return cells;
}

export function SlotDayPicker({ schedule, selectedDate, onSelectDate }: SlotDayPickerProps) {
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  const [open, setOpen] = useState(false);
  const locale = i18n.language === 'ar' ? 'ar' : 'en';

  const months = useMemo(
    () =>
      listBookingMonths(
        schedule.calendar.selectableRangeStart,
        schedule.calendar.selectableRangeEnd,
      ),
    [schedule.calendar],
  );

  const [monthIndex, setMonthIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (selectedDate) {
      const selected = new Date(`${selectedDate}T12:00:00`);
      const index = months.findIndex(
        (item) => item.year === selected.getFullYear() && item.month === selected.getMonth(),
      );
      setMonthIndex(index >= 0 ? index : 0);
      return;
    }
    setMonthIndex(0);
  }, [open, selectedDate, months]);

  const visibleMonth = months[monthIndex] ?? months[0];

  const monthLabel = useMemo(() => {
    if (!visibleMonth) {
      return '';
    }
    const date = new Date(visibleMonth.year, visibleMonth.month, 1);
    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  }, [locale, visibleMonth]);

  const weekdayLabels = useMemo(() => {
    const base = new Date(2024, 0, 7);
    return Array.from({ length: 7 }, (_, index) => {
      const d = new Date(base);
      d.setDate(base.getDate() + index);
      return d.toLocaleDateString(locale, { weekday: 'narrow' });
    });
  }, [locale]);

  const cells = useMemo(() => {
    if (!visibleMonth) {
      return [];
    }
    return buildCalendarCells(
      visibleMonth.year,
      visibleMonth.month,
      schedule.calendar.selectableRangeStart,
      schedule.calendar.selectableRangeEnd,
    );
  }, [schedule.calendar, visibleMonth]);

  const fieldLabel = selectedDate
    ? formatSelectedLabel(selectedDate, locale)
    : t('patient.slotSelectDate');

  const canGoPrev = monthIndex > 0;
  const canGoNext = monthIndex < months.length - 1;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('patient.slotSelectDate')}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={t('patient.slotSelectDate')}
        style={[styles.field, isRTL && styles.fieldRtl]}
      >
        <Text style={[styles.fieldText, !selectedDate && styles.placeholder]} numberOfLines={1}>
          {fieldLabel}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={[styles.monthHeader, isRTL && styles.rowReverse]}>
              <Pressable
                onPress={() => {
                  if (canGoPrev) {
                    setMonthIndex((current) => current - 1);
                  }
                }}
                disabled={!canGoPrev}
                accessibilityRole="button"
                accessibilityLabel={t('common.back')}
                style={[styles.navButton, !canGoPrev && styles.navButtonDisabled]}
                hitSlop={8}
              >
                <Ionicons
                  name={isRTL ? 'chevron-forward' : 'chevron-back'}
                  size={20}
                  color={canGoPrev ? colors.primary : colors.disabled}
                />
              </Pressable>
              <Text style={styles.sheetTitle}>{monthLabel}</Text>
              <Pressable
                onPress={() => {
                  if (canGoNext) {
                    setMonthIndex((current) => current + 1);
                  }
                }}
                disabled={!canGoNext}
                accessibilityRole="button"
                style={[styles.navButton, !canGoNext && styles.navButtonDisabled]}
                hitSlop={8}
              >
                <Ionicons
                  name={isRTL ? 'chevron-back' : 'chevron-forward'}
                  size={20}
                  color={canGoNext ? colors.primary : colors.disabled}
                />
              </Pressable>
            </View>

            <Text style={[styles.hint, isRTL && styles.rtlText]}>
              {t('patient.slotBookingWindowHint', { days: schedule.bookingHorizonDays })}
            </Text>
            <Text style={[styles.hint, isRTL && styles.rtlText]}>{t('patient.slotWorkingDaysHint')}</Text>

            <View style={[styles.weekdayRow, isRTL && styles.rowReverse]}>
              {weekdayLabels.map((label, index) => (
                <Text key={`${label}-${index}`} style={styles.weekdayLabel}>
                  {label}
                </Text>
              ))}
            </View>

            <View style={[styles.grid, isRTL && styles.rowReverse]}>
              {cells.map((cell, index) => {
                if (!cell.date) {
                  return <View key={`empty-${index}`} style={styles.dayCellOuter} />;
                }

                const working = isWorkingDate(cell.date, schedule.workingWeekdays);
                const selectable = cell.inRange && working;
                const selected = cell.date === selectedDate;
                const dayNumber = Number(cell.date.slice(8, 10));

                return (
                  <View key={cell.date} style={styles.dayCellOuter}>
                    <Pressable
                      disabled={!selectable}
                      onPress={() => {
                        onSelectDate(cell.date!);
                        setOpen(false);
                      }}
                      accessibilityRole="button"
                      accessibilityState={{ selected, disabled: !selectable }}
                      style={[
                        styles.dayCellInner,
                        working && cell.inRange && styles.workingDay,
                        selected && styles.selectedDay,
                        !selectable && styles.disabledDay,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNumber,
                          working && cell.inRange && styles.workingDayText,
                          selected && styles.selectedDayText,
                          !selectable && styles.disabledDayText,
                        ]}
                      >
                        {dayNumber}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            <Pressable onPress={() => setOpen(false)} style={styles.closeButton}>
              <Text style={styles.closeLabel}>{t('common.cancel')}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text,
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
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  navButtonDisabled: {
    backgroundColor: colors.border,
  },
  sheetTitle: {
    ...typography.subtitle,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  weekdayLabel: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.sm,
  },
  dayCellOuter: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  dayCellInner: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workingDay: {
    backgroundColor: colors.primaryLight,
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  disabledDay: {
    opacity: 0.4,
  },
  dayNumber: {
    ...typography.label,
    color: colors.textSecondary,
  },
  workingDayText: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  selectedDayText: {
    color: colors.surface,
  },
  disabledDayText: {
    color: colors.disabled,
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
