import { Globe, Moon, RefreshCw, Sun, Trash2, Coins } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CURRENCIES } from '@/data/currencies';
import { toPersianDigits } from '@/utils/numberUtils';

export function SettingsPage() {
  const { settings, setSettings, resetSettings, clearHistory, history, toast } = useApp();

  const save = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings({ [key]: value } as Partial<typeof settings>);
    toast('تنظیمات ذخیره شد.', 'success');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-600/20">
          <Coins className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">تنظیمات</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">ترجیحات برنامه را مدیریت کنید.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Language */}
        <section className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">زبان</h2>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 rounded-xl bg-primary-50 text-primary-700 font-semibold text-sm">فارسی</span>
          </div>
        </section>

        {/* Display unit */}
        <section className="card p-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">واحد نمایش ریال ایران</h2>
          <p className="text-xs text-slate-500 dark:text-slate-300 mb-3">هر ۱۰ ریال برابر با ۱ تومان است.</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => save('displayUnit', 'rial')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm border transition-colors ${settings.displayUnit === 'rial' ? 'bg-primary-50 text-primary-700 border-primary-300' : 'border-slate-200 text-slate-700 dark:text-slate-300 hover:border-primary-300'}`}
            >ریال</button>
            <button
              onClick={() => save('displayUnit', 'toman')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm border transition-colors ${settings.displayUnit === 'toman' ? 'bg-primary-50 text-primary-700 border-primary-300' : 'border-slate-200 text-slate-700 dark:text-slate-300 hover:border-primary-300'}`}
            >تومان</button>
          </div>
        </section>

        {/* Theme */}
        <section className="card p-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">تم</h2>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => save('theme', 'light')} className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition-colors ${settings.theme === 'light' ? 'bg-primary-50 text-primary-700 border-primary-300' : 'border-slate-200 text-slate-700 dark:text-slate-300 hover:border-primary-300'}`}>
              <Sun className="w-5 h-5" /> روشن
            </button>
            <button onClick={() => save('theme', 'dark')} className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition-colors ${settings.theme === 'dark' ? 'bg-primary-50 text-primary-700 border-primary-300' : 'border-slate-200 text-slate-700 dark:text-slate-300 hover:border-primary-300'}`}>
              <Moon className="w-5 h-5" /> تیره
            </button>
            <button onClick={() => save('theme', 'auto')} className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition-colors ${settings.theme === 'auto' ? 'bg-primary-50 text-primary-700 border-primary-300' : 'border-slate-200 text-slate-700 dark:text-slate-300 hover:border-primary-300'}`}>
              <RefreshCw className="w-5 h-5" /> خودکار
            </button>
          </div>
        </section>

        {/* Default currencies */}
        <section className="card p-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">ارزهای پیش‌فرض</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1.5 block">ارز مبدأ پیش‌فرض</span>
              <select
                value={settings.defaultFrom}
                onChange={(e) => save('defaultFrom', e.target.value)}
                className="input-base"
              >
                {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.nameFa} — {c.code}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1.5 block">ارز مقصد پیش‌فرض</span>
              <select
                value={settings.defaultTo}
                onChange={(e) => save('defaultTo', e.target.value)}
                className="input-base"
              >
                {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.nameFa} — {c.code}</option>)}
              </select>
            </label>
          </div>
        </section>

        {/* Danger zone */}
        <section className="card p-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">مدیریت داده</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => { clearHistory(); toast('تاریخچه پاک شد.', 'info'); }}
              className="btn-ghost px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 border border-slate-200"
            >
              <Trash2 className="w-4 h-4" />
              پاک کردن تاریخچه {history.length > 0 && `(${toPersianDigits(history.length)})`}
            </button>
            <button
              onClick={() => { resetSettings(); toast('تنظیمات بازنشانی شد.', 'info'); }}
              className="btn-ghost px-4 py-2.5 text-sm border border-slate-200"
            >
              <RefreshCw className="w-4 h-4" />
              بازنشانی تنظیمات
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
