import { getCurrency } from '@/data/currencies';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[+d]);
}

export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

/** Sanitize raw user input for an amount: digits + single dot, no negatives. */
export function sanitizeAmount(raw: string): string {
  const en = toEnglishDigits(raw).replace(/,/g, '');
  const cleaned = en.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
  return cleaned;
}

export function isValidAmount(raw: string): boolean {
  if (!raw) return false;
  const s = sanitizeAmount(raw);
  if (s === '.' || s === '') return false;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0;
}

/** Format a number intelligently: trim trailing zeros but keep precision for tiny rates. */
export function formatNumber(value: number, opts?: { minDecimals?: number; maxDecimals?: number }): string {
  if (!Number.isFinite(value)) return '۰';
  const abs = Math.abs(value);
  let maxDecimals = opts?.maxDecimals ?? 4;
  const minDecimals = opts?.minDecimals ?? 0;
  if (abs !== 0 && abs < 1) maxDecimals = Math.max(maxDecimals, 4);
  if (abs !== 0 && abs < 0.01) maxDecimals = 6;
  if (abs !== 0 && abs < 0.0001) maxDecimals = 8;

  let fixed = value.toFixed(maxDecimals);
  // Trim trailing zeros but keep minDecimals
  if (fixed.includes('.')) {
    const [int, dec] = fixed.split('.');
    let trimmedDec = dec.replace(/0+$/, '');
    if (trimmedDec.length < minDecimals) trimmedDec = trimmedDec.padEnd(minDecimals, '0');
    fixed = trimmedDec ? `${int}.${trimmedDec}` : int;
  }
  // Group integer part with thousands separators (Persian-friendly)
  const [int, dec] = fixed.split('.');
  const groupedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
  return toPersianDigits(dec ? `${groupedInt}.${dec}` : groupedInt);
}

/** Compact display for the result with currency name. */
export function formatResult(value: number, currencyCode: string): string {
  const c = getCurrency(currencyCode);
  const formatted = formatNumber(value, { minDecimals: 2, maxDecimals: 4 });
  return c ? `${formatted} ${c.nameFa}` : formatted;
}

export function formatRate(value: number): string {
  return formatNumber(value, { minDecimals: 2, maxDecimals: 8 });
}

/** Format a 1-unit rate line: "1 دلار آمریکا = 0.۸۷ یورو" */
export function formatRateLine(fromCode: string, toCode: string, rate: number): string {
  const from = getCurrency(fromCode);
  const to = getCurrency(toCode);
  if (!from || !to) return '';
  return `۱ ${from.nameFa} = ${formatRate(rate)} ${to.nameFa}`;
}
