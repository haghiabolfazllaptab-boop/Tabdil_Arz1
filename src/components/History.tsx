import { ArrowLeft, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getCurrency } from '@/data/currencies';
import { formatNumber, toPersianDigits } from '@/utils/numberUtils';
import { displayAmount } from '@/utils/currencyUtils';
import { shortDateTimeFa } from '@/utils/dateUtils';

export function History() {
  const { history, removeHistory, clearHistory, toast, settings } = useApp();

  if (history.length === 0) {
    return (
      <section className="card p-8 text-center" aria-labelledby="history-title">
        <h2 id="history-title" className="text-base font-extrabold text-slate-900 dark:text-white mb-3">تاریخچه</h2>
        <div className="py-8 text-slate-500 dark:text-slate-300">
          <p className="text-sm font-semibold mb-1">هنوز سابقه‌ای ندارید.</p>
          <p className="text-xs">اولین تبدیل خود را انجام دهید.</p>
        </div>
      </section>
    );
  }

  const onClear = () => {
    clearHistory();
    toast('تاریخچه پاک شد.', 'info');
  };

  return (
    <section className="card p-5" aria-labelledby="history-title">
      <div className="flex items-center justify-between mb-3">
        <h2 id="history-title" className="text-base font-extrabold text-slate-900 dark:text-white">تاریخچه</h2>
        <button onClick={onClear} className="btn-ghost px-3 py-1.5 text-sm text-error-600 hover:bg-error-50" aria-label="پاک کردن تاریخچه">
          <Trash2 className="w-4 h-4" />
          پاک کردن تاریخچه
        </button>
      </div>
      <ul className="space-y-2">
        {history.map((h) => {
          const f = getCurrency(h.from);
          const t = getCurrency(h.to);
          if (!f || !t) return null;
          const disp = displayAmount(h.result, h.to, settings.displayUnit);
          return (
            <li key={h.id} className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-primary-300 transition-colors">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="text-lg">{f.flag}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white nums-fa">{toPersianDigits(formatNumber(h.amount, { minDecimals: 0, maxDecimals: 2 }))}</span>
                </span>
                <ArrowLeft className="w-4 h-4 text-slate-300 shrink-0" />
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="text-lg">{t.flag}</span>
                  <span className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-300 nums-fa truncate">
                      {toPersianDigits(formatNumber(disp?.amount ?? h.result, { minDecimals: 2, maxDecimals: 4 }))}
                      <span className="text-xs font-semibold text-slate-500 mr-1">{disp?.nameFa ?? t.nameFa}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-300">{shortDateTimeFa(new Date(h.at))}</span>
                  </span>
                </span>
              </div>
              <button
                onClick={() => { removeHistory(h.id); toast('سابقه حذف شد.', 'info'); }}
                className="p-1.5 rounded-lg text-slate-300 hover:text-error-500 hover:bg-error-50 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="حذف این سابقه"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
