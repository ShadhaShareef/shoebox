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
      className={`rounded-md border px-3 py-2 text-sm transition-fast ${pageNumber === page ? 'border-ink bg-ink text-white' : 'border-border bg-white text-ink hover:border-ink hover:bg-paper'}`}
    >
      {pageNumber}
    </button>
  );

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Pagination">
      {pages.map(renderButton)}
    </nav>
  );
};

export default Pagination;
