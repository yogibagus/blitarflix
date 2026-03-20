export function SkeletonHero() {
  return (
    <div className="relative h-[60vh] sm:h-[75vh] lg:h-[85vh] w-full overflow-hidden bg-zinc-900">
      {/* Backdrop placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </div>

      {/* Content placeholder */}
      <div className="absolute inset-0 flex items-end sm:items-center">
        <div className="px-4 sm:px-8 lg:px-16 w-full sm:max-w-2xl pb-24 sm:pb-0">
          <div className="space-y-3 sm:space-y-4">
            {/* Brand badge */}
            <div className="hidden sm:block h-4 w-24 bg-zinc-700/50 rounded animate-pulse" />
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 sm:h-10 lg:h-12 w-full bg-zinc-700/50 rounded animate-pulse" />
              <div className="h-8 sm:h-10 lg:h-12 w-3/4 bg-zinc-700/50 rounded animate-pulse" />
            </div>
            
            {/* Meta info */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="h-6 w-16 bg-zinc-700/50 rounded animate-pulse" />
              <div className="h-6 w-16 bg-zinc-700/50 rounded animate-pulse" />
              <div className="h-6 w-12 bg-zinc-700/50 rounded animate-pulse" />
            </div>
            
            {/* Description */}
            <div className="hidden sm:block space-y-2">
              <div className="h-4 w-full bg-zinc-700/50 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-zinc-700/50 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-zinc-700/50 rounded animate-pulse" />
            </div>
            
            {/* Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 pt-2">
              <div className="h-10 sm:h-12 w-28 sm:w-32 bg-zinc-700/50 rounded-lg animate-pulse" />
              <div className="h-10 sm:h-12 w-28 sm:w-32 bg-zinc-700/50 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Dots indicator placeholder */}
      <div className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-2 w-2 bg-zinc-700/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );
}