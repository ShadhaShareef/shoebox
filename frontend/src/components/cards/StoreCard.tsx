import type { Store } from '../../types';

type StoreCardProps = {
  store: Store;
};

const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <article className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Store</p>
          <h3 className="mt-2 text-xl font-semibold text-neutral-900">{store.name}</h3>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase text-brand-700">{store.distance}</span>
      </div>
      <div className="mt-4 space-y-2 text-sm text-neutral-600">
        <p>{store.address}</p>
        <p>{store.city}</p>
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-neutral-600">
        <span>{store.hours}</span>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">{store.availability}</span>
      </div>
    </article>
  );
};

export default StoreCard;
