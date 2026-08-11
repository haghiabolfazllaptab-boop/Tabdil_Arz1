import { ArrowLeft } from 'lucide-react';
import { POPULAR_CONVERSIONS } from '@/config';
import { getCurrency } from '@/data/currencies';
import { useApp } from '@/context/AppContext';

interface Props {
  onPick: (from: string, to: string) => void;
}

export function PopularConversions({ onPick }: Props) {
  const { toast } = useApp();

  const pick = (from: string, to: string) => {
    onPick(from, to);
    toast('تبدیل انتخاب شد.', 'info');
  };

  return (
    <section className="card p-5" aria-labelledby="popular-title">
      <h2 id="popular-title" className="text-base font-extrabold text-slate-900 dark:text-white mb-3">تبدیل‌های محبوب</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {POPULAR_CONVERSIONS.map(({ from, to }) => {
          const f = getCurrency(from);
          const t = getCurrency(to);
          if (!f || !t) return null;
          return (
            <button
              key={`${from}-${to}`}
              onClick={() => pick(from, to)}
              className="group flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-600/10 transition-all text-right"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-xl">{f.flag}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{f.nameFa}</span>
              </span>
              <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{t.nameFa}</span>
                <span className="text-xl">{t.flag}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
