import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetProductsQuery } from '../redux/api/productApi';
import ProductGrid from '../components/products/ProductGrid';
import SidebarFilters from '../components/products/SidebarFilters';
import Pagination from '../components/ui/Pagination';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const DEFAULT_FILTERS = { sort: '-createdAt', page: 1, limit: 12 };

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getFiltersFromParams = () => {
    const f = {};
    for (const [k, v] of searchParams.entries()) f[k] = v;
    return { ...DEFAULT_FILTERS, ...f };
  };

  const filters = getFiltersFromParams();

  const queryParams = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
  );

  const { data, isLoading } = useGetProductsQuery(queryParams);

  const handleFilterChange = (newFilters) => {
    const params = {};
    for (const [k, v] of Object.entries(newFilters)) {
      if (v !== '' && v !== undefined) params[k] = String(v);
    }
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>Products – EMarket</title>
        <meta name="description" content="Browse thousands of products across all categories." />
      </Helmet>

      <div className="container-custom py-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {filters.keyword ? `Search: "${filters.keyword}"` : 'All Products'}
            </h1>
            {data && (
              <p className="text-sm text-gray-500 mt-1">
                {data.total} product{data.total !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden btn-secondary text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4 text-lg">Filters</h2>
              <SidebarFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={data?.products} isLoading={isLoading} count={12} />
            {data && (
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
