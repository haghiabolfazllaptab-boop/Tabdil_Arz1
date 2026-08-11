import { useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Home } from '@/pages/Home';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PopularConversions } from '@/components/PopularConversions';
import { FavoriteCurrencies } from '@/components/FavoriteCurrencies';

function PopularPage() {
  const { setPage, toast } = useApp();
  const go = (from: string, to: string) => {
    toast('تبدیل انتخاب شد.', 'info');
    setPage('home');
    setTimeout(() => {
      const event = new CustomEvent('currencyx:pick', { detail: { from, to } });
      window.dispatchEvent(event);
    }, 50);
  };
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-600/20">
          <ArrowLeftRight className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">ارزهای محبوب</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">تبدیل‌های پرکاربرد و علاقه‌مندی‌های شما.</p>
        </div>
      </div>
      <div className="space-y-6">
        <PopularConversions onPick={go} />
        <FavoriteCurrencies bundle={null} onPick={(code) => go('USD', code)} />
      </div>
    </div>
  );
}

export default function App() {
  const { page } = useApp();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 dark:text-white transition-colors">
      <main className="flex-1 w-full">
        {page === 'home' && <Home />}
        {page === 'popular' && <PopularPage />}
        {page === 'history' && <HistoryPage />}
        {page === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}
