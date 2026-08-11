import { X } from 'lucide-react';
import { QUICK_AMOUNTS } from '@/config';
import { isValidAmount, sanitizeAmount, toPersianDigits, toEnglishDigits } from '@/utils/numberUtils';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  id?: string;
  placeholder?: string;
}

export function AmountInput({ label, value, onChange, id, placeholder = 'مبلغ را وارد کنید' }: Props) {
  const valid = isValidAmount(value);
  const set = (v: string) => onChange(sanitizeAmount(v));

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => set(e.target.value)}
          placeholder={placeholder}
          className={`input-base text-lg font-bold nums-fa pl-10 ${
            value && !valid ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10' : ''
          }`}
          dir="ltr"
          aria-invalid={!!value && !valid}
          aria-describedby={value && !valid ? `${id}-error` : undefined}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700/40"
            aria-label="پاک کردن مبلغ"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {value && !valid && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-error-600 animate-fade-in">
          لطفاً یک مبلغ معتبر وارد کنید.
        </p>
      )}

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {QUICK_AMOUNTS.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => onChange(String(amt))}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-700/40 text-slate-700 dark:text-slate-300 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-600/20 dark:hover:text-primary-300 transition-colors nums-fa"
          >
            {toPersianDigits(amt.toLocaleString('en-US'))}
          </button>
        ))}
      </div>
    </div>
  );
}

export { isValidAmount, toEnglishDigits };
