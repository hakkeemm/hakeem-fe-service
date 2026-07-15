import { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  } satisfies TextStyle,
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  } satisfies TextStyle,
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  } satisfies TextStyle,
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } satisfies TextStyle,
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } satisfies TextStyle,
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } satisfies TextStyle,
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  } satisfies TextStyle,
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  } satisfies TextStyle,
} as const;
