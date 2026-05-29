export function SkeletonBox({ className = '' }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <SkeletonBox className="aspect-square w-full" />
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-4 w-1/2" />
      <SkeletonBox className="h-8 w-full" />
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100 animate-pulse">
      <SkeletonBox className="h-4 w-24" />
      <SkeletonBox className="h-4 w-32 flex-1" />
      <SkeletonBox className="h-6 w-20 rounded-full" />
      <SkeletonBox className="h-4 w-16" />
    </div>
  );
}
