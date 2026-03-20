export function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[120px] sm:w-[150px] md:w-[170px] lg:w-[190px]">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-700 animate-pulse" />
        
        {/* Media type badge placeholder */}
        <div className="absolute top-2 left-2 z-10">
          <div className="h-4 w-8 bg-zinc-700/50 rounded" />
        </div>
        
        {/* Info overlay placeholder */}
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-50">
          <div className="flex items-center gap-2">
            <div className="h-3 w-8 bg-zinc-700/50 rounded" />
            <div className="h-3 w-10 bg-zinc-700/50 rounded" />
          </div>
        </div>
        
        {/* Play button placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0">
          <div className="h-12 w-12 rounded-full bg-zinc-700/50" />
        </div>
      </div>
      
      {/* Title placeholder */}
      <div className="mt-2">
        <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
      </div>
    </div>
  );
}