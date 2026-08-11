import { Search, Star, X, Check } from 'lucide-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import { CURRENCIES, type Currency } from '@/data/currencies';
import { toEnglishDigits } from '@/utils/numberUtils';
import { useApp } from '@/context/AppContext';

interface Props {
  label: string;
  value: string;
  onChange: (code: string) => void;
  exclude?: string;
  id?: string;
}

export function CurrencySelector({ label, value, onChange, exclude, id }: Props) {
  const { favorites, toggleFavorite, toast } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const current = CURRENCIES.find((c) => c.code === value);

  const filtered = useMemo(() => {
    const q = toEnglishDigits(query).trim().toLowerCase();
    const sorted = [...CURRENCIES].sort((a, b) => {
      const af = favorites.includes(a.code) ? 0 : 1;
      const bf = favorites.includes(b.code) ? 0 : 1;
      return af - bf;
    });
    if (!q) return sorted.filter((c) => c.code !== exclude);
    return sorted.filter((c) => {
      if (c.code === exclude) return false;
      return (
        c.code.toLowerCase().includes(q) ||
        c.nameFa.includes(query.trim()) ||
        c.nameEn.toLowerCase().includes(q)
      );
    });
  }, [query, exclude, favorites]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlight(0);
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      } else if (e.key === 'Enter' && filtered[highlight]) {
        e.preventDefault();
        select(filtered[highlight]);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, filtered, highlight]);

  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${highlight}"]`);
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlight]);

  const select = (c: Currency) => {
    onChange(c.code);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onToggleFav = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    const wasFav = favorites.includes(code);
    toggleFavorite(code);
    toast(wasFav ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد', 'info');
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        onClick={() => setOpen(true)}
        className="input-base flex items-center justify-between gap-2 text-right hover:border-primary-400 group"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          {current ? (
            <>
              <span className="text-2xl leading-none shrink-0">{current.flag}</span>
              <span className="flex flex-col items-start min-w-0">
                <span className="font-semibold text-slate-900 dark:text-white truncate">{current.nameFa}</span>
                <span className="text-xs text-slate-500 dark:text-slate-300">{current.code}</span>
              </span>
            </>
          ) : (
            <span className="text-slate-500">انتخاب ارز</span>
          )}
        </span>
        <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-600/20 dark:text-primary-300 px-2 py-1 rounded-lg shrink-0">
          {current?.code}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="relative card w-full sm:max-w-md max-h-[85vh] sm:max-h-[80vh] flex flex-col rounded-b-none sm:rounded-2xl animate-slide-in"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 dark:text-white">انتخاب ارز</h3>
                <button onClick={() => setOpen(false)} className="btn-ghost p-1.5" aria-label="بستن">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی ارز..."
                  className="input-base pr-9"
                  type="text"
                  inputMode="search"
                />
              </div>
            </div>

            <div ref={listRef} className="overflow-y-auto scroll-thin p-2 flex-1" role="listbox">
              {filtered.length === 0 ? (
                <p className="text-center text-slate-500 py-10 text-sm">ارزی پیدا نشد.</p>
              ) : (
                filtered.map((c, idx) => {
                  const isFav = favorites.includes(c.code);
                  const active = c.code === value;
                  return (
                    <div
                      key={c.code}
                      data-idx={idx}
                      role="option"
                      aria-selected={active}
                      onMouseEnter={() => setHighlight(idx)}
                      onClick={() => select(c)}
                      className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        highlight === idx ? 'bg-primary-50 dark:bg-primary-600/20' : ''
                      } ${active ? 'ring-1 ring-primary-300' : ''}`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl leading-none shrink-0">{c.flag}</span>
                        <span className="flex flex-col items-start min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-white truncate">{c.nameFa}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-300">
                            {c.code} — {c.nameEn}
                          </span>
                        </span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        {active && <Check className="w-4 h-4 text-primary-600" />}
                        <button
                          onClick={(e) => onToggleFav(e, c.code)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/40"
                          aria-label={isFav ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-warning-500 text-warning-500' : 'text-slate-300'}`} />
                        </button>
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
