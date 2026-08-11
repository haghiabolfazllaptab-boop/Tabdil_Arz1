import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';
import { AmountInput, isValidAmount } from './AmountInput';
import { SwapButton } from './SwapButton';
import { ConversionResult } from './ConversionResult';
import { useApp } from '@/context/AppContext';
import { convert, getRates, isStale, type RateBundle } from '@/services/exchangeRateService';
import { toPersianDigits } from '@/utils/numberUtils';

interface Props {
  initialFrom?: string;
  initialTo?: string;
  initialAmount?: string;
}

export function CurrencyConverter({ initialFrom, initialTo, initialAmount }: Props) {
  const { settings, addHistory, toast } = useApp();
  const [from, setFrom] = useState(initialFrom ?? settings.defaultFrom);
  const [to, setTo] = useState(initialTo ?? settings.defaultTo);
  const [amount, setAmount] = useState(initialAmount ?? '10');
  const [bundle, setBundle] = useState<RateBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingCache, setUsingCache] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const recorded = useRef<string>('');

  // Sync when parent passes new initial props (popular conversions / favorites)
  useEffect(() => {
    if (initialFrom) setFrom(initialFrom);
  }, [initialFrom]);
  useEffect(() => {
    if (initialTo) setTo(initialTo);
  }, [initialTo]);

  const fetchRates = useCallback(async (force: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const b = await getRates({ base: 'USD', force });
      setBundle(b);
      setUsingCache(b.source === 'cache' || isStale(b));
      setError(null);
    } catch (err) {
      if (bundle) {
        setUsingCache(true);
      } else {
        setError('دریافت نرخ ارز با مشکل مواجه شد.');
        setUsingCache(false);
      }
    } finally {
      setLoading(false);
    }
  }, [bundle]);

  useEffect(() => {
    fetchRates(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onFocus = () => {
      if (bundle && isStale(bundle)) fetchRates(false);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [bundle, fetchRates]);

  useEffect(() => {
    if (!bundle || !isValidAmount(amount)) {
      setResult(null);
      return;
    }
    const amt = Number(amount);
    const r = convert(bundle, amt, from, to);
    setResult(r);
  }, [bundle, amount, from, to]);

  useEffect(() => {
    if (result == null || !isValidAmount(amount)) return;
    const key = `${amount}|${from}|${to}|${result.toFixed(6)}|${bundle?.fetchedAt ?? 0}`;
    if (recorded.current === key) return;
    const t = setTimeout(() => {
      recorded.current = key;
      addHistory({ amount: Number(amount), from, to, result });
    }, 700);
    return () => clearTimeout(t);
  }, [result, amount, from, to, bundle, addHistory]);

  const onSwap = () => {
    setFrom(to);
    setTo(from);
    recorded.current = '';
  };

  const onRefresh = () => {
    fetchRates(true);
    toast('در حال به‌روزرسانی نرخ‌ها...', 'info');
  };

  const amtNum = isValidAmount(amount) ? Number(amount) : 0;

  return (
    <section className="card p-5 sm:p-6 animate-slide-up" aria-labelledby="converter-title">
      <div className="flex items-center justify-between mb-4">
        <h2 id="converter-title" className="text-lg font-extrabold text-slate-900 dark:text-white">تبدیل ارز</h2>
        <button
          onClick={onRefresh}
          className="btn-ghost p-2"
          aria-label="به‌روزرسانی نرخ‌ها"
          title="به‌روزرسانی نرخ‌ها"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        <CurrencySelector label="ارز مبدأ" value={from} onChange={setFrom} exclude={to} id="from-currency" />

        <AmountInput label="مبلغ" value={amount} onChange={setAmount} id="amount" placeholder="مبلغ را وارد کنید" />

        <SwapButton onSwap={onSwap} />

        <CurrencySelector label="ارز مقصد" value={to} onChange={setTo} exclude={from} id="to-currency" />

        <ConversionResult
          amount={amtNum}
          from={from}
          to={to}
          result={result}
          bundle={bundle}
          loading={loading}
          error={error}
          usingCache={usingCache}
          onToggleFavorite={() => {}}
        />
      </div>

      <p className="sr-only">{toPersianDigits(amtNum.toLocaleString('en-US'))}</p>
    </section>
  );
}
