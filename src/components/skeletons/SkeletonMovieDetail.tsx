export function SkeletonMovieDetail() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <div className="bg-zinc-950 h-14 sm:h-16 border-b border-zinc-800" />
      
      {/* Hero Section */}
      <div className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] bg-zinc-900">
        {/* Background */}
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 h-full min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-end px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
          <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10 items-end lg:items-end">
            {/* Poster */}
            <div className="hidden sm:block flex-shrink-0 w-36 sm:w-44 lg:w-52 xl:w-60 aspect-[2/3] rounded-xl bg-zinc-800 animate-pulse ring-1 ring-zinc-700" />
            
            {/* Info */}
            <div className="flex-1 pb-4 lg:pb-8 space-y-3 sm:space-y-4">
              {/* Title */}
              <div className="h-10 sm:h-12 lg:h-14 w-3/4 sm:w-1/2 bg-zinc-800 rounded animate-pulse" />
              
              {/* Meta info */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-6 w-16 bg-zinc-800 rounded animate-pulse" />
                <div className="h-6 w-20 bg-zinc-800 rounded animate-pulse" />
                <div className="h-6 w-24 bg-zinc-800 rounded animate-pulse" />
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 sm:h-7 w-20 sm:w-24 bg-zinc-800 rounded-full animate-pulse" />
                ))}
              </div>
              
              {/* Buttons */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-12 sm:h-14 w-32 sm:w-40 bg-zinc-800 rounded-lg animate-pulse" />
                <div className="h-12 sm:h-14 w-32 sm:w-40 bg-zinc-800 rounded-lg animate-pulse" />
              </div>
              
              {/* Tagline */}
              <div className="h-5 sm:h-6 w-1/2 bg-zinc-800 rounded animate-pulse" />
              
              {/* Overview */}
              <div className="space-y-2 max-w-3xl">
                <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cast Section */}
      <section className="px-3 sm:px-8 lg:px-16 py-6 sm:py-8 bg-zinc-950">
        <div className="h-7 sm:h-8 w-20 bg-zinc-800 rounded animate-pulse mb-4" />
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 bg-zinc-900/80 rounded-full pr-3 sm:pr-4 ring-1 ring-zinc-800">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-800 animate-pulse" />
              <div className="space-y-1">
                <div className="h-3 sm:h-4 w-20 sm:w-28 bg-zinc-800 rounded animate-pulse" />
                <div className="h-2 sm:h-3 w-16 sm:w-20 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Similar Movies Section */}
      <section className="px-3 sm:px-8 lg:px-16 py-6 sm:py-8 bg-zinc-950">
        <div className="h-8 sm:h-9 w-40 bg-zinc-800 rounded animate-pulse mb-4 sm:mb-6" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="relative aspect-[2/3] rounded-lg bg-zinc-800 animate-pulse ring-1 ring-zinc-700" />
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto py-6 sm:py-8">
        <div className="text-center px-4">
          <div className="h-6 sm:h-7 w-32 bg-zinc-800 rounded animate-pulse mx-auto mb-2 sm:mb-3" />
          <div className="h-4 sm:h-5 w-3/4 sm:w-2/3 bg-zinc-800 rounded animate-pulse mx-auto mb-2 sm:mb-3" />
          <div className="h-4 sm:h-5 w-40 bg-zinc-800 rounded animate-pulse mx-auto" />
        </div>
      </footer>
    </div>
  );
}