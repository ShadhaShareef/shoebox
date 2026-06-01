import type { Dispatch, SetStateAction } from 'react';

type QuantitySelectorProps = {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
};

const QuantitySelector = ({ quantity, setQuantity }: QuantitySelectorProps) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-3xl border border-neutral-200 bg-white p-2">
      <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-3xl border border-neutral-200 text-lg text-neutral-700 transition hover:bg-neutral-50" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
        −
      </button>
      <span className="inline-flex h-10 min-w-[52px] items-center justify-center text-base font-semibold text-neutral-900">{quantity}</span>
      <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-3xl border border-neutral-200 text-lg text-neutral-700 transition hover:bg-neutral-50" onClick={() => setQuantity(quantity + 1)}>
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
