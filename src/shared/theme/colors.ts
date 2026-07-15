export const colors = {
  primary: '#0B6E4F',
  primaryDark: '#085540',
  primaryLight: '#E6F4EF',
  secondary: '#1B4965',
  accent: '#C9A227',
  background: '#F7F9F8',
  surface: '#FFFFFF',
  text: '#12263A',
  textSecondary: '#5B6B7C',
  border: '#D7E0E7',
  error: '#C62828',
  errorLight: '#FDECEA',
  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#ED6C02',
  disabled: '#A8B3BE',
  overlay: 'rgba(18, 38, 58, 0.45)',
} as const;

export type ColorToken = keyof typeof colors;
