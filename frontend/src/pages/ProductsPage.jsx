import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, X } from 'lucide-react';
import { useGetProductsQuery } from '../redux/api/productApi';
import { useGetCategoriesQuery } from '../redux/api/categoryApi';
import ProductGrid from '../components/products/ProductGrid';
import SidebarFilters from '../components/products/SidebarFilters';
import Pagination from '../components/ui/Pagination';
import Breadcrumbs from '../components/ui/Breadcrumbs';

// Show all products by default — user can paginate when filtering down to many results
const DEFAULT_FILTERS = { sort: '-createdAt', page: 1, limit: 100 };

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: catData } = useGetCategoriesQuery();

  // Build filters from URL params
  const filters = useMemo(() => {
    const f = {};
    for (const [k, v] of searchParams.entries()) f[k] = v;
    return { ...DEFAULT_FILTERS, ...f };
  }, [searchParams]);

  // Resolve category slug → ObjectId so both Navbar links (slug) and
  // sidebar selections (ID) route correctly to the same API query
  const queryFilters = useMemo(() => {
    if (!filters.category || !catData?.categories) return filters;
    // Already a valid ObjectId — pass through
    if (/^[a-f\d]{24}$/i.test(filters.category)) return filters;
    // Resolve slug to ID
    const cat = catData.categories.find((c) => c.slug === filters.category);
    return { ...filters, category: cat?._id ?? '' };
  }, [filters, catData?.categories]);

  const { data, isLoading } = useGetProductsQuery(
    Object.fromEntries(
      Object.entries(queryFilters).filter(([, v]) => v !== '' && v !== undefined)
    )
  );

  const handleFilterChange = (newFilters) => {
    const params = {};
    for (const [k, v] of Object.entries(newFilters)) {
      if (v !== '' && v !== undefined) params[k] = String(v);
    }
    setSearchParams(params);
    setSidebarOpen(false);
  };

  const handleReset = () => {
    setSearchParams({});
    setSidebarOpen(false);
  };

  // Resolve active category name for the heading
  const activeCategoryName = useMemo(() => {
    if (!filters.category || !catData?.categories) return null;
    return catData.categories.find(
      (c) => c._id === filters.category || c.slug === filters.category
    )?.name ?? null;
  }, [filters.category, catData?.categories]);

  const headingText = filters.keyword
    ? `"${filters.keyword}"`
    : activeCategoryName ?? 'All Pieces';

  return (
    <>
      <Helmet>
        <title>{headingText} — AUREM</title>
        <meta name="description" content="Browse the AUREM collection of curated luxury pieces." />
      </Helmet>

      {/* ── Mobile filter drawer ───────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-espresso/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-champagne border-r border-sand-gold/40 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-sand-gold/40 shrink-0">
              <p className="sec-label mb-0">Refine</p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-mid-gold hover:text-espresso transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <SidebarFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      )}

      <div className="container-custom py-10 md:py-14">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collection' },
            ...(activeCategoryName ? [{ label: activeCategoryName }] : []),
          ]}
        />

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="sec-label">The Collection</p>
            <h1 className="font-display font-light text-3xl md:text-5xl text-espresso leading-tight tracking-wide">
              {headingText}
            </h1>
            {data && (
              <p className="text-sm font-sans text-mid-gold mt-2">
                {data.total} {data.total === 1 ? 'piece' : 'pieces'}
              </p>
            )}
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center gap-2 text-[9px] tracking-widest uppercase font-sans text-primary-600 border border-primary-600 px-4 py-2.5 hover:bg-primary-600 hover:text-champagne transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.5} />
            Refine
          </button>
        </div>

        {/* ── Body: sidebar + grid ─────────────────────────────────── */}
        <div className="flex gap-10 lg:gap-14 items-start">

          {/* Sidebar — desktop only */}
          <aside className="hidden md:block w-60 lg:w-72 shrink-0">
            <div className="card p-6 lg:p-8 sticky top-28">
              <SidebarFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={data?.products}
              isLoading={isLoading}
              count={12}
              cols="sidebar"
            />
            {data && data.pages > 1 && (
              <Pagination
                page={data.page}
                pages={data.pages}
                onPageChange={(p) => handleFilterChange({ ...filters, page: p })}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
