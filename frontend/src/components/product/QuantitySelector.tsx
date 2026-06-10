import type { Dispatch, SetStateAction } from 'react';
import { MinusIcon, PlusIcon } from '../ui/icons';

type QuantitySelectorProps = {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
};

const QuantitySelector = ({ quantity, setQuantity }: QuantitySelectorProps) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-border bg-white p-1">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-ink transition-fast hover:border-ink"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        aria-label="Decrease quantity"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="inline-flex h-10 min-w-12 items-center justify-center px-2 text-sm font-semibold text-ink">{quantity}</span>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-ink transition-fast hover:border-ink"
        onClick={() => setQuantity(quantity + 1)}
        aria-label="Increase quantity"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;
