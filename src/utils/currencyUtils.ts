import { getCurrency } from '@/data/currencies';

/** Apply the Iranian Toman display preference. IRR amounts are divided by 10 and shown as تومان. */
export function displayAmount(value: number, code: string, unit: 'rial' | 'toman'): { amount: number; code: string; nameFa: string } | null {
  const c = getCurrency(code);
  if (!c) return null;
  if (code === 'IRR' && unit === 'toman') {
    return { amount: value / 10, code: 'IRR', nameFa: 'تومان' };
  }
  return { amount: value, code, nameFa: c.nameFa };
}

export function unitLabel(code: string, unit: 'rial' | 'toman'): string {
  if (code === 'IRR') return unit === 'toman' ? 'تومان' : 'ریال';
  const c = getCurrency(code);
  return c ? c.nameFa : code;
}
