import { SkeletonCard } from './SkeletonCard';

interface SkeletonGridProps {
  count?: number;
  showFilterPlaceholders?: boolean;
}

export function SkeletonGrid({ count = 12, showFilterPlaceholders = true }: SkeletonGridProps) {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="space-y-2">
        <div className="h-8 sm:h-9 lg:h-10 w-48 sm:w-56 lg:w-64 bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 w-32 bg-zinc-800/50 rounded animate-pulse" />
      </div>

      {/* Filter placeholders */}
      {showFilterPlaceholders && (
        <div className="mb-6 space-y-4">
          <div>
            <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse mb-2" />
            <div className="flex gap-2 overflow-x-hidden">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-9 w-24 bg-zinc-800 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          </div>
          
          <div>
            <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse mb-2" />
            <div className="flex gap-2 overflow-x-hidden">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-9 w-20 bg-zinc-800 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="cursor-pointer">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-700 animate-pulse" />
              
              {/* Media type badge placeholder */}
              <div className="absolute top-2 left-2 z-10">
                <div className="h-4 w-8 bg-zinc-700/50 rounded animate-pulse" />
              </div>
              
              {/* Info overlay placeholder */}
              <div className="absolute bottom-0 left-0 right-0 p-2 opacity-50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-8 bg-zinc-700/50 rounded animate-pulse" />
                  <div className="h-3 w-10 bg-zinc-700/50 rounded animate-pulse" />
                </div>
              </div>
              
              {/* Play button placeholder */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-zinc-700/50 animate-pulse" />
              </div>
            </div>
            
            {/* Title placeholder */}
            <div className="mt-2">
              <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}