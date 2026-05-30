import { Package } from 'lucide-react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';

// cols="sidebar"  → 1 / 2 / 3  (products page, next to a sidebar)
// cols="default"  → 2 / 2 / 4  (homepage featured strip — compact)
const GRID = {
  sidebar: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
  default: 'grid-cols-2 md:grid-cols-4',
};

export default function ProductGrid({ products, isLoading, count = 8, cols = 'default' }) {
  const gridClass = GRID[cols] ?? GRID.default;

  if (isLoading) {
    return (
      <div className={`grid ${gridClass} gap-5 md:gap-6`}>
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="py-24 flex flex-col items-center text-center">
        <Package className="w-12 h-12 text-sand-gold mb-5" strokeWidth={1} />
        <p className="font-display font-light text-2xl text-espresso mb-2">No pieces found</p>
        <p className="text-xs font-sans text-mid-gold tracking-wider">
          Try adjusting your filters or explore another category.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClass} gap-5 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
