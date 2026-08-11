export type Page = 'home' | 'history' | 'settings' | 'popular';

export const POPULAR_CONVERSIONS: Array<{ from: string; to: string }> = [
  { from: 'USD', to: 'EUR' },
  { from: 'USD', to: 'GBP' },
  { from: 'USD', to: 'AED' },
  { from: 'EUR', to: 'USD' },
  { from: 'USD', to: 'TRY' },
  { from: 'USD', to: 'IRR' },
];

export const QUICK_AMOUNTS = [10, 50, 100, 500, 1000, 5000];

export const HISTORY_LIMIT = 50;

export const DEFAULT_SETTINGS = {
  language: 'fa' as const,
  displayUnit: 'rial' as const,
  theme: 'light' as const,
  defaultFrom: 'USD',
  defaultTo: 'EUR',
};
