import { z } from 'zod';

/** Matches ASP.NET Identity rules used by Hakeem BE. */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

/** Letters from any script (Arabic, Latin, etc.) plus common name punctuation. */
export const FULL_NAME_REGEX = /^[\p{L}\p{M}]+(?:[ '\-.\p{L}\p{M}]+)*$/u;

export function getNameCharacterCount(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return [...segmenter.segment(trimmed)].length;
  }

  return [...trimmed].length;
}

export const emailField = z
  .string()
  .min(1, 'auth.emailRequired')
  .email('auth.emailInvalid');

export const passwordField = z
  .string()
  .min(1, 'auth.passwordRequired')
  .min(8, 'auth.passwordMin')
  .regex(PASSWORD_REGEX, 'auth.passwordRegex');

export const fullNameField = z.string().superRefine((value, ctx) => {
  const trimmed = value.trim();

  if (!trimmed) {
    ctx.addIssue({
      code: 'custom',
      message: 'auth.fullNameRequired',
    });
    return;
  }

  if (getNameCharacterCount(trimmed) < 2) {
    ctx.addIssue({
      code: 'custom',
      message: 'auth.fullNameMin',
    });
  }

  if (!FULL_NAME_REGEX.test(trimmed)) {
    ctx.addIssue({
      code: 'custom',
      message: 'auth.fullNameInvalid',
    });
  }
});
