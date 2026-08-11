import { ArrowLeftRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-7 h-7 rounded-lg bg-primary-600 text-white">
            <ArrowLeftRight className="w-4 h-4" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-bold text-slate-900 dark:text-white">CurrencyX</div>
            <div className="text-xs text-slate-500 dark:text-slate-300">مبدل ارز سریع و ساده</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-300">نرخ‌ها از سرویس آنلاین دریافت می‌شوند.</p>
      </div>
    </footer>
  );
}
