import { createContext, useContext } from 'react';
import type { Page } from '@/config';

export interface HistoryEntry {
  id: string;
  amount: number;
  from: string;
  to: string;
  result: number;
  at: number;
}

export interface Settings {
  language: 'fa';
  displayUnit: 'rial' | 'toman';
  theme: 'light' | 'dark' | 'auto';
  defaultFrom: string;
  defaultTo: string;
}

export interface AppState {
  page: Page;
  setPage: (p: Page) => void;

  converterFrom: string;
  converterTo: string;
  setConverter: (from: string, to: string) => void;

  settings: Settings;
  setSettings: (s: Partial<Settings>) => void;
  resetSettings: () => void;

  favorites: string[];
  toggleFavorite: (code: string) => void;

  history: HistoryEntry[];
  addHistory: (e: Omit<HistoryEntry, 'id' | 'at'>) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;

  toast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
