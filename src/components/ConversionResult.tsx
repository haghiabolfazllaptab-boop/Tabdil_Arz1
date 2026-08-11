import { Check, Copy, Share2, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getCurrency } from '@/data/currencies';
import { formatNumber, formatRate, formatRateLine, toPersianDigits } from '@/utils/numberUtils';
import { timeAgoFa, fullDateFa } from '@/utils/dateUtils';
import { displayAmount } from '@/utils/currencyUtils';
import type { RateBundle } from '@/services/exchangeRateService';
import { rateBetween } from '@/services/exchangeRateService';

interface Props {
  amount: number;
  from: string;
  to: string;
  result: number | null;
  bundle: RateBundle | null;
  loading: boolean;
  error: string | null;
  usingCache: boolean;
  onToggleFavorite: (code: string) => void;
}

export function ConversionResult({ amount, from, to, result, bundle, loading, error, usingCache, onToggleFavorite }: Props) {
  const { settings, favorites, toast } = useApp();
  const [copied, setCopied] = useState(false);
  const toCur = getCurrency(to);
  const fromCur = getCurrency(from);
  const isFav = favorites.includes(to);

  const displayed = result != null ? displayAmount(result, to, settings.displayUnit) : null;
  const rate = bundle ? rateBetween(bundle, from, to) : null;
  const reverseRate = bundle && rate ? 1 / rate : null;

  const shareText = () => {
    if (result == null || !fromCur || !toCur) return '';
    const disp = displayAmount(result, to, settings.displayUnit);
    return `${toPersianDigits(formatNumber(amount, { minDecimals: 0, maxDecimals: 2 }))} ${fromCur.nameFa} برابر با ${toPersianDigits(formatNumber(disp?.amount ?? result, { minDecimals: 2, maxDecimals: 4 }))} ${disp?.nameFa ?? toCur.nameFa} است.`;
  };

  const onCopy = async () => {
    if (result == null) return;
    try {
      await navigator.clipboard.writeText(shareText());
      setCopied(true);
      toast('نتیجه با موفقیت کپی شد.', 'success');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast('کپی انجام نشد. دوباره تلاش کنید.', 'error');
    }
  };

  const onShare = async () => {
    const text = shareText();
    if (!text) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'CurrencyX', text });
      } else {
        await navigator.clipboard.writeText(text);
        toast('نتیجه کپی شد (اشتراک‌گذاری پشتیبانی نمی‌شود).', 'info');
      }
    } catch {
      /* user cancelled share */
    }
  };

  const onFav = () => {
    onToggleFavorite(to);
    toast(isFav ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد', 'info');
  };

  if (loading && result == null) {
    return (
      <div className="card p-5 mt-2">
        <div className="skeleton h-4 w-32 mb-3" />
        <div className="skeleton h-12 w-2/3 mb-4" />
        <div className="skeleton h-4 w-1/2" />
        <p className="mt-4 text-sm text-slate-500">در حال دریافت نرخ ارز...</p>
      </div>
    );
  }

  if (error && result == null) {
    return (
      <div className="card p-5 mt-2 border-error-100 bg-error-50/40">
        <p className="text-sm font-semibold text-error-600">{error}</p>
        <p className="text-xs text-slate-500 mt-1">اتصال اینترنت خود را بررسی کنید.</p>
      </div>
    );
  }

  if (result == null || !toCur || !fromCur) {
    return (
      <div className="card p-5 mt-2">
        <p className="text-sm text-slate-500">این ارز در حال حاضر پشتیبانی نمی‌شود.</p>
      </div>
    );
  }

  return (
    <div className="card p-5 mt-2 animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-300">مبلغ تبدیل‌شده</span>
        <div className="flex items-center gap-1">
          <button onClick={onFav} className="btn-ghost p-2" aria-label={isFav ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'} title={isFav ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'}>
            <Star className={`w-4 h-4 ${isFav ? 'fill-warning-500 text-warning-500' : 'text-slate-300'}`} />
          </button>
          <button onClick={onCopy} className="btn-ghost p-2" aria-label="کپی نتیجه" title="کپی نتیجه">
            {copied ? <Check className="w-4 h-4 text-success-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={onShare} className="btn-ghost p-2" aria-label="اشتراک‌گذاری" title="اشتراک‌گذاری">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-baseline gap-2 flex-wrap animate-result-pop" key={`${from}-${to}-${result}`}>
        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white nums-fa">
          {toPersianDigits(formatNumber(displayed?.amount ?? result, { minDecimals: 2, maxDecimals: 4 }))}
        </span>
        <span className="text-lg font-semibold text-primary-600 dark:text-primary-300">{displayed?.nameFa ?? toCur.nameFa}</span>
      </div>

      {rate != null && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-secondary-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 nums-fa">
              نرخ تبدیل: {toPersianDigits(`1 ${fromCur.code} = ${formatRate(rate)} ${toCur.code}`)}
            </span>
          </div>
          {reverseRate != null && Number.isFinite(reverseRate) && (
            <p className="text-xs text-slate-500 dark:text-slate-300 pr-6 nums-fa">
              نرخ معکوس: {toPersianDigits(`1 ${toCur.code} = ${formatRate(reverseRate)} ${fromCur.code}`)}
            </p>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-300 pr-6">
            {toPersianDigits(formatRateLine(from, to, rate))}
          </p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
        <span>آخرین به‌روزرسانی: {bundle ? toPersianDigits(timeAgoFa(bundle.fetchedAt)) : '—'}</span>
        {usingCache && (
          <span className="flex items-center gap-1 text-warning-600 font-semibold">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-warning-500" />
            نمایش آخرین نرخ ذخیره‌شده
          </span>
        )}
      </div>
      {bundle && (
        <p className="sr-only">زمان دقیق به‌روزرسانی: {fullDateFa(new Date(bundle.fetchedAt))}</p>
      )}
    </div>
  );
}
