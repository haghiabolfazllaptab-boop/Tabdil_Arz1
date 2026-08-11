import { Star, Trash2 } from 'lucide-react';
import { getCurrency } from '@/data/currencies';
import { useApp } from '@/context/AppContext';
import { convert, type RateBundle } from '@/services/exchangeRateService';
import { formatNumber, toPersianDigits } from '@/utils/numberUtils';
import { displayAmount } from '@/utils/currencyUtils';

interface Props {
  bundle: RateBundle | null;
  baseAmount?: number;
  onPick: (code: string) => void;
}

export function FavoriteCurrencies({ bundle, baseAmount = 1, onPick }: Props) {
  const { favorites, settings, toggleFavorite, toast } = useApp();
  const base = 'USD';

  if (favorites.length === 0) {
    return (
      <section className="card p-5" aria-labelledby="fav-title">
        <h2 id="fav-title" className="text-base font-extrabold text-slate-900 dark:text-white mb-2">ارزهای موردعلاقه</h2>
        <div className="text-center py-6 text-slate-500 dark:text-slate-300">
          <Star className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm">هنوز ارزی به علاقه‌مندی‌ها اضافه نکرده‌اید.</p>
        </div>
      </section>
    );
  }

  const remove = (code: string) => {
    toggleFavorite(code);
    toast('از علاقه‌مندی‌ها حذف شد.', 'info');
  };

  return (
    <section className="card p-5" aria-labelledby="fav-title">
      <h2 id="fav-title" className="text-base font-extrabold text-slate-900 dark:text-white mb-3">ارزهای موردعلاقه</h2>
      <div className="space-y-2">
        {favorites.map((code) => {
          const c = getCurrency(code);
          if (!c) return null;
          const rate = bundle ? convert(bundle, baseAmount, base, code) : null;
          const disp = rate != null ? displayAmount(rate, code, settings.displayUnit) : null;
          return (
            <div key={code} className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-primary-300 transition-colors">
              <button onClick={() => onPick(code)} className="flex items-center gap-2.5 min-w-0 flex-1 text-right">
                <span className="text-xl shrink-0">{c.flag}</span>
                <span className="flex flex-col items-start min-w-0">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{c.nameFa}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-300">
                    {toPersianDigits(`1 ${base} = `)}
                    {disp ? toPersianDigits(formatNumber(disp.amount, { minDecimals: 2, maxDecimals: 6 })) : '...'}
                    {` ${disp?.nameFa ?? ''}`}
                  </span>
                </span>
              </button>
              <button onClick={() => remove(code)} className="p-1.5 rounded-lg text-slate-300 hover:text-error-500 hover:bg-error-50" aria-label={`حذف ${c.nameFa} از علاقه‌مندی‌ها`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
