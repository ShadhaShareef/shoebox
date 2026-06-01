import type { MouseEventHandler } from 'react';

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, pageSize, total, onPageChange }: PaginationProps) => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  if (pageCount <= 1) {
    return null;
  }

  const renderButton = (pageNumber: number) => (
    <button
      type="button"
      onClick={() => onPageChange(pageNumber)}
      className={`rounded-xl border px-3 py-2 text-sm transition ${pageNumber === page ? 'border-brand-500 bg-brand-600 text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'}`}
    >
      {pageNumber}
    </button>
  );

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {pages.map(renderButton)}
    </nav>
  );
};

export default Pagination;
