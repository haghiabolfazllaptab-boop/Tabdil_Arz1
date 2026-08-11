import { ArrowLeftRight, History as HistoryIcon, Home, Menu, Settings as SettingsIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { Page } from '@/config';

const NAV: Array<{ id: Page; label: string; icon: typeof Home }> = [
  { id: 'home', label: 'تبدیل ارز', icon: Home },
  { id: 'popular', label: 'ارزهای محبوب', icon: ArrowLeftRight },
  { id: 'history', label: 'تاریخچه', icon: HistoryIcon },
  { id: 'settings', label: 'تنظیمات', icon: SettingsIcon },
];

export function Header() {
  const { page, setPage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (p: Page) => {
    setPage(p);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => go('home')} className="flex items-center gap-2.5 group" aria-label="CurrencyX — صفحه اصلی">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary-600 text-white shadow-pop group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="w-5 h-5" />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">CurrencyX</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-300">مبدل ارز</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1" aria-label="ناوبری اصلی">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`btn-ghost px-3.5 py-2 text-sm ${page === id ? 'bg-primary-50 text-primary-700 dark:bg-primary-600/20 dark:text-primary-300' : ''}`}
                aria-current={page === id ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="منو"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 animate-slide-in" aria-label="ناوبری موبایل">
          <div className="px-4 py-2 flex flex-col gap-1">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`btn-ghost justify-start px-3 py-2.5 text-sm w-full ${page === id ? 'bg-primary-50 text-primary-700 dark:bg-primary-600/20 dark:text-primary-300' : ''}`}
                aria-current={page === id ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
