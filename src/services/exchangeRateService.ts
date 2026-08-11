import { isSupported } from '@/data/currencies';
import { loadJSON, saveJSON } from '@/utils/storageUtils';

export interface RateBundle {
  base: string;
  rates: Record<string, number>;
  fetchedAt: number; // epoch ms
  source: 'live' | 'cache';
}

const CACHE_KEY = 'currencyx:rates:v1';
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

/**
 * Swappable API layer. Primary: open.er-api.com (free, no key).
 * Fallback: exchangerate.host (free, no key).
 * A VITE_EXCHANGE_API_KEY can be configured for providers that require one.
 */
const API_KEY = (import.meta.env.VITE_EXCHANGE_API_KEY as string | undefined)?.trim();

interface FetchResult {
  base: string;
  rates: Record<string, number>;
}

async function fetchPrimary(base: string, signal: AbortSignal): Promise<FetchResult> {
  const url = `https://open.er-api.com/v6/latest/${base}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`primary HTTP ${res.status}`);
  const json = await res.json();
  if (!json || typeof json.rates !== 'object') throw new Error('primary malformed');
  return { base: json.base_code || base, rates: json.rates as Record<string, number> };
}

async function fetchFallback(base: string, signal: AbortSignal): Promise<FetchResult> {
  const params = new URLSearchParams({ base });
  if (API_KEY) params.set('access_key', API_KEY);
  const res = await fetch(`https://api.exchangerate.host/live?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`fallback HTTP ${res.status}`);
  const json = await res.json();
  if (!json || typeof json.quotes !== 'object') throw new Error('fallback malformed');
  const quotes = json.quotes as Record<string, number>;
  const rates: Record<string, number> = {};
  for (const [k, v] of Object.entries(quotes)) {
    // exchangerate.host returns USDUSD, USDEUR, etc.
    rates[k.replace(base, '')] = v;
  }
  rates[base] = 1;
  return { base, rates };
}

function filterSupported(rates: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [code, value] of Object.entries(rates)) {
    if (isSupported(code) && Number.isFinite(value)) out[code] = value;
  }
  out[rates[Object.keys(rates)[0]] ? 'USD' : 'USD'] = out['USD'] ?? 1;
  return out;
}

function readCache(): RateBundle | null {
  const cached = loadJSON<RateBundle | null>(CACHE_KEY, null);
  if (!cached || !cached.rates) return null;
  return cached;
}

function writeCache(bundle: RateBundle): void {
  saveJSON(CACHE_KEY, bundle);
}

export interface GetRatesOptions {
  base?: string;
  force?: boolean;
}

/**
 * Get rates for a base currency. Uses cache if fresh (<30min) unless force=true.
 * Returns a bundle tagged with whether it came from cache or live.
 */
export async function getRates(opts: GetRatesOptions = {}): Promise<RateBundle> {
  const base = opts.base ?? 'USD';
  const cached = readCache();

  if (cached && !opts.force && Date.now() - cached.fetchedAt < CACHE_TTL && cached.base === base) {
    return { ...cached, source: 'cache' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    let result: FetchResult;
    try {
      result = await fetchPrimary(base, controller.signal);
    } catch (primaryErr) {
      result = await fetchFallback(base, controller.signal);
    }
    const rates = filterSupported(result.rates);
    if (!rates[base]) rates[base] = 1;
    const bundle: RateBundle = { base, rates, fetchedAt: Date.now(), source: 'live' };
    writeCache(bundle);
    return bundle;
  } catch (err) {
    if (cached) return { ...cached, source: 'cache' };
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/** Convert an amount using a rate bundle. Returns null if a rate is missing. */
export function convert(bundle: RateBundle, amount: number, from: string, to: string): number | null {
  if (!bundle.rates[from] || !bundle.rates[to]) return null;
  // rates are `base -> X`. amount in `from` => base => to.
  const inBase = amount / bundle.rates[from];
  return inBase * bundle.rates[to];
}

/** Direct rate: 1 from = ? to. */
export function rateBetween(bundle: RateBundle, from: string, to: string): number | null {
  if (!bundle.rates[from] || !bundle.rates[to]) return null;
  return bundle.rates[to] / bundle.rates[from];
}

export function isStale(bundle: RateBundle): boolean {
  return Date.now() - bundle.fetchedAt > CACHE_TTL;
}
