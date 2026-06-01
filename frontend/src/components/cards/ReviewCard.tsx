import type { Review } from '../../types';

type ReviewCardProps = {
  review: Review;
};

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <article className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-900">{review.headline}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">{review.author}</p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">{review.rating}★</span>
      </div>
      <p className="mt-4 text-sm text-neutral-700">{review.body}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-neutral-400">{review.created_at}</p>
    </article>
  );
};

export default ReviewCard;
