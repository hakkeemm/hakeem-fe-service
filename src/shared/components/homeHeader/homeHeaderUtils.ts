import { colors } from '../../theme/colors';

/** Time-of-day greeting key for i18n (`common.goodMorning` etc.). */
export function getGreetingKey(date = new Date()): 'common.goodMorning' | 'common.goodAfternoon' | 'common.goodEvening' {
  const hour = date.getHours();
  if (hour < 12) {
    return 'common.goodMorning';
  }
  if (hour < 17) {
    return 'common.goodAfternoon';
  }
  return 'common.goodEvening';
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export const homeHeaderColors = {
  background: '#F4F6F8',
  surface: colors.surface,
  avatarFallback: colors.primaryLight,
} as const;
