import { useEffect, useState } from 'react';
import { getRates, isStale, type RateBundle } from '@/services/exchangeRateService';
import { useApp } from '@/context/AppContext';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { PopularConversions } from '@/components/PopularConversions';
import { FavoriteCurrencies } from '@/components/FavoriteCurrencies';

export function Home() {
  const { setPage, toast } = useApp();
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [bundle, setBundle] = useState<RateBundle | null>(null);

  useEffect(() => {
    let active = true;
    getRates({ base: 'USD' })
      .then((b) => { if (active) setBundle(b); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const onFocus = () => {
      if (bundle && isStale(bundle)) {
        getRates({ base: 'USD', force: true }).then(setBundle).catch(() => {});
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [bundle]);

  const pickConversion = (f: string, t: string) => {
    setFrom(f);
    setTo(t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pickFavorite = (code: string) => {
    setFrom('USD');
    setTo(code);
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast('ارز مقصد تغییر کرد.', 'info');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      <section className="text-center mb-6 sm:mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
          تبدیل ارز، ساده و سریع
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-300 max-w-xl mx-auto">
          مبلغ موردنظر خود را وارد کنید و ارزش آن را به ارز دلخواه ببینید.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="space-y-6">
          <CurrencyConverter initialFrom={from} initialTo={to} />
          <PopularConversions onPick={pickConversion} />
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24">
          <FavoriteCurrencies bundle={bundle} onPick={pickFavorite} />
        </aside>
      </div>
    </div>
  );
}
