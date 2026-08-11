import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppContext, type AppState, type HistoryEntry, type Settings } from './AppContext';
import type { Page } from '@/config';
import { DEFAULT_SETTINGS, HISTORY_LIMIT } from '@/config';
import { loadJSON, saveJSON } from '@/utils/storageUtils';

interface ToastItem {
  id: number;
  msg: string;
  type: 'success' | 'error' | 'info';
}

interface Props {
  children: ReactNode;
}

const SETTINGS_KEY = 'currencyx:settings:v1';
const FAV_KEY = 'currencyx:favorites:v1';
const HIST_KEY = 'currencyx:history:v1';

export function AppProvider({ children }: Props) {
  const [page, setPage] = useState<Page>('home');
  const [settings, setSettingsState] = useState<Settings>(() => ({ ...DEFAULT_SETTINGS, ...loadJSON(SETTINGS_KEY, {}) }));
  const [favorites, setFavorites] = useState<string[]>(() => loadJSON(FAV_KEY, []));
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadJSON(HIST_KEY, []));
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastId = useRef(0);

  const [converterFrom, setConverterFrom] = useState<string>(() => loadJSON(SETTINGS_KEY, DEFAULT_SETTINGS).defaultFrom ?? 'USD');
  const [converterTo, setConverterTo] = useState<string>(() => loadJSON(SETTINGS_KEY, DEFAULT_SETTINGS).defaultTo ?? 'EUR');

  // Keep converter defaults in sync if settings change before any manual pick
  useEffect(() => {
    setConverterFrom((prev) => (prev === 'USD' || prev ? prev : settings.defaultFrom));
  }, [settings.defaultFrom]);

  // Theme application
  useEffect(() => {
    const root = document.documentElement;
    const apply = (dark: boolean) => root.classList.toggle('dark', dark);
    if (settings.theme === 'dark') apply(true);
    else if (settings.theme === 'light') apply(false);
    else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      apply(mq.matches);
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [settings.theme]);

  const toast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  const setSettings = useCallback((s: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...s };
      saveJSON(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(() => {
      saveJSON(SETTINGS_KEY, DEFAULT_SETTINGS);
      return { ...DEFAULT_SETTINGS };
    });
    setConverterFrom(DEFAULT_SETTINGS.defaultFrom);
    setConverterTo(DEFAULT_SETTINGS.defaultTo);
  }, []);

  const setConverter = useCallback((from: string, to: string) => {
    setConverterFrom(from);
    setConverterTo(to);
  }, []);

  const toggleFavorite = useCallback((code: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(code);
      const next = exists ? prev.filter((c) => c !== code) : [...prev, code];
      saveJSON(FAV_KEY, next);
      return next;
    });
  }, []);

  const addHistory = useCallback((e: Omit<HistoryEntry, 'id' | 'at'>) => {
    setHistory((prev) => {
      const entry: HistoryEntry = { ...e, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now() };
      const next = [entry, ...prev].slice(0, HISTORY_LIMIT);
      saveJSON(HIST_KEY, next);
      return next;
    });
  }, []);

  const removeHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      saveJSON(HIST_KEY, next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory(() => {
      saveJSON(HIST_KEY, []);
      return [];
    });
  }, []);

  const value = useMemo<AppState>(() => ({
    page, setPage,
    converterFrom, converterTo, setConverter,
    settings, setSettings, resetSettings,
    favorites, toggleFavorite,
    history, addHistory, removeHistory, clearHistory,
    toast,
  }), [page, converterFrom, converterTo, setConverter, settings, favorites, history, setSettings, resetSettings, toggleFavorite, addHistory, removeHistory, clearHistory, toast]);

  return (
    <AppContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} />
    </AppContext.Provider>
  );
}

function ToastViewport({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[92%] max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto animate-toast-in flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-pop border ${
            t.type === 'success' ? 'bg-success-50 text-success-700 border-success-100'
            : t.type === 'error' ? 'bg-error-50 text-error-600 border-error-100'
            : 'bg-primary-50 text-primary-700 border-primary-100'
          }`}
        >
          <span className={`inline-block w-2 h-2 rounded-full ${t.type === 'success' ? 'bg-success-500' : t.type === 'error' ? 'bg-error-500' : 'bg-primary-500'}`} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}
