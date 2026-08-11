import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './context/AppProvider';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
        <Header />
        <main className="flex-1 w-full">
          <App />
        </main>
        <Footer />
      </div>
    </AppProvider>
  </StrictMode>
);
