export const colors = {
  /** Main brand / CTA blue (login & primary actions) */
  primary: '#2F80ED',
  primaryDark: '#1B6AD4',
  primaryLight: '#E8F1FD',

  secondary: '#1A1D21',
  accent: '#C9A227',

  background: '#FFFFFF',
  surface: '#FFFFFF',

  text: '#1A1D21',
  textSecondary: '#9AA0A6',
  textPlaceholder: '#B0B5BB',

  border: '#E6E8EB',
  borderStrong: '#C5CAD1',
  divider: '#E6E8EB',

  error: '#C62828',
  errorLight: '#FDECEA',
  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#ED6C02',
  disabled: '#A8B3BE',
  overlay: 'rgba(26, 29, 33, 0.45)',

  /** Google brand palette */
  google: '#4285F4',
  googleRed: '#EA4335',
  googleYellow: '#FBBC05',
  googleGreen: '#34A853',
  googleText: '#3C4043',
} as const;

export type ColorToken = keyof typeof colors;
