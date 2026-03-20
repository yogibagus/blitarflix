import { SkeletonCard } from './SkeletonCard';

interface SkeletonRowProps {
  count?: number;
  showTitle?: boolean;
  showSeeMore?: boolean;
}

export function SkeletonRow({ count = 6, showTitle = true, showSeeMore = true }: SkeletonRowProps) {
  return (
    <div className="py-3 sm:py-4">
      {showTitle && (
        <div className="flex items-center justify-between mb-3 sm:mb-4 px-3 sm:px-8 lg:px-16">
          <div className="h-6 sm:h-7 lg:h-8 w-40 sm:w-48 lg:w-56 bg-zinc-800 rounded animate-pulse" />
          {showSeeMore && (
            <div className="h-5 sm:h-6 w-20 bg-zinc-800 rounded animate-pulse" />
          )}
        </div>
      )}
      
      <div className="flex gap-2 sm:gap-3 px-3 sm:px-8 lg:px-16 pb-2">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}