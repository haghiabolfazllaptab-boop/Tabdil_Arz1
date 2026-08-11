import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onSwap: () => void;
  disabled?: boolean;
}

export function SwapButton({ onSwap, disabled }: Props) {
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setSpinning(true);
    onSwap();
    setTimeout(() => setSpinning(false), 350);
  };

  return (
    <div className="flex justify-center my-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title="جابجایی ارزها"
        aria-label="جابجایی ارزها"
        className="group grid place-items-center w-11 h-11 rounded-full bg-white border border-slate-200 dark:bg-ink-800 dark:border-slate-700 text-primary-600 shadow-soft hover:shadow-pop hover:border-primary-300 hover:bg-primary-50 active:scale-95 transition-all disabled:opacity-50"
      >
        <ArrowUpDown className={`w-5 h-5 transition-transform ${spinning ? 'animate-spin-swap' : 'group-hover:scale-110'}`} />
      </button>
    </div>
  );
}
