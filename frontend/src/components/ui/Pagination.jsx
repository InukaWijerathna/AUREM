import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const nums = [];
    const range = 2;
    for (let i = Math.max(1, page - range); i <= Math.min(pages, page + range); i++) {
      nums.push(i);
    }
    return nums;
  };

  const btnBase =
    'min-w-[2.5rem] h-10 flex items-center justify-center text-xs font-sans font-medium border transition-colors';

  return (
    <div className="flex items-center justify-center gap-1 mt-12">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`${btnBase} px-3 border-sand-gold/60 text-mid-gold hover:border-primary-600 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
      </button>

      {page > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`${btnBase} border-sand-gold/60 text-mid-gold hover:border-primary-600 hover:text-primary-600`}
          >
            1
          </button>
          {page > 4 && (
            <span className="min-w-[2.5rem] h-10 flex items-center justify-center text-xs text-mid-gold">
              …
            </span>
          )}
        </>
      )}

      {getPageNumbers().map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`${btnBase} ${
            num === page
              ? 'bg-primary-600 text-champagne border-primary-600'
              : 'border-sand-gold/60 text-mid-gold hover:border-primary-600 hover:text-primary-600'
          }`}
        >
          {num}
        </button>
      ))}

      {page < pages - 2 && (
        <>
          {page < pages - 3 && (
            <span className="min-w-[2.5rem] h-10 flex items-center justify-center text-xs text-mid-gold">
              …
            </span>
          )}
          <button
            onClick={() => onPageChange(pages)}
            className={`${btnBase} border-sand-gold/60 text-mid-gold hover:border-primary-600 hover:text-primary-600`}
          >
            {pages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className={`${btnBase} px-3 border-sand-gold/60 text-mid-gold hover:border-primary-600 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
