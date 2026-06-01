import type { MouseEventHandler } from 'react';

type SizeSelectorProps = {
  sizes: string[];
  value: string;
  onChange: (value: string) => void;
};

const SizeSelector = ({ sizes, value, onChange }: SizeSelectorProps) => {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onChange(size)}
          className={`rounded-3xl border px-3 py-2 text-sm font-semibold transition ${value === size ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'}`}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;
