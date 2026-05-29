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

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {page > 3 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm">1</button>
          {page > 4 && <span className="px-2 text-gray-400">…</span>}
        </>
      )}

      {getPageNumbers().map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
            num === page
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {num}
        </button>
      ))}

      {page < pages - 2 && (
        <>
          {page < pages - 3 && <span className="px-2 text-gray-400">…</span>}
          <button onClick={() => onPageChange(pages)} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm">{pages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
