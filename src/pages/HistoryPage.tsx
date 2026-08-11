import { History as HistoryIcon } from 'lucide-react';
import { History } from '@/components/History';
import { useApp } from '@/context/AppContext';

export function HistoryPage() {
  const { setPage } = useApp();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-600/20">
          <HistoryIcon className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">تاریخچه تبدیل‌ها</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">آخرین تبدیل‌های شما در این مرورگر ذخیره می‌شوند.</p>
        </div>
      </div>
      <History />
      <div className="mt-4 text-center">
        <button onClick={() => setPage('home')} className="btn-soft px-4 py-2">بازگشت به تبدیل ارز</button>
      </div>
    </div>
  );
}
