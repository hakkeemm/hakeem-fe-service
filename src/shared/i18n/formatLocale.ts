/** Locale helpers for EN / AR display (Eastern Arabic digits when Arabic). */

export function resolveAppLocale(language: string): string {
  return language.startsWith('ar') ? 'ar-EG' : 'en-US';
}

export function isArabicLanguage(language: string): boolean {
  return language.startsWith('ar');
}

export function formatLocaleNumber(
  value: number,
  language: string,
  options?: Intl.NumberFormatOptions,
): string {
  const locale = resolveAppLocale(language);
  return new Intl.NumberFormat(locale, {
    numberingSystem: isArabicLanguage(language) ? 'arab' : 'latn',
    ...options,
  }).format(value);
}

/** Zero-padded integer for countdown cells (e.g. 05 → ٠٥). */
export function formatLocalePaddedInt(value: number, language: string, digits = 2): string {
  return formatLocaleNumber(value, language, {
    minimumIntegerDigits: digits,
    maximumFractionDigits: 0,
    useGrouping: false,
  });
}

export function formatLocaleDate(
  date: Date,
  language: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const locale = resolveAppLocale(language);
  return date.toLocaleDateString(locale, {
    numberingSystem: isArabicLanguage(language) ? 'arab' : 'latn',
    ...options,
  });
}

export function formatLocaleTime(
  date: Date,
  language: string,
  options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' },
): string {
  const locale = resolveAppLocale(language);
  return date.toLocaleTimeString(locale, {
    numberingSystem: isArabicLanguage(language) ? 'arab' : 'latn',
    ...options,
  });
}

export function formatLocaleCurrency(amount: number, language: string, currency = 'USD'): string {
  return formatLocaleNumber(amount, language, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
