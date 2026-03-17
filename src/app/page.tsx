'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { getImageUrl, TMDBMovie } from '@/lib/tmdb';
import { Header } from '@/components/Header';

// ============ HERO SECTION COMPONENT ============
interface HeroSectionProps {
  movies: TMDBMovie[];
}

function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [videoKeys, setVideoKeys] = useState<Record<number, string | null>>({});

  const featuredMovies = movies.slice(0, 5);
  const currentMovie = featuredMovies[currentIndex];
  const currentVideoKey = currentMovie ? videoKeys[currentMovie.id] : null;

  // Fetch video for current movie
  useEffect(() => {
    const fetchVideo = async () => {
      if (!currentMovie || videoKeys[currentMovie.id] !== undefined) return;
      
      try {
        const res = await fetch(`/api/movies/${currentMovie.id}/videos`);
        const data = await res.json();
        const trailer = data.results?.find(
          (v: { type: string; site: string }) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        setVideoKeys(prev => ({
          ...prev,
          [currentMovie.id]: trailer?.key || null
        }));
      } catch {
        setVideoKeys(prev => ({
          ...prev,
          [currentMovie.id]: null
        }));
      }
    };

    fetchVideo();
  }, [currentMovie, videoKeys]);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
      setImageError(false);
    }, 10000);

    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (!currentMovie) return null;

  const backdropUrl = currentMovie.backdrop_path
    ? getImageUrl(currentMovie.backdrop_path, 'backdrop', 'original')
    : null;

  const trailerUrl = currentVideoKey
    ? `https://www.youtube.com/embed/${currentVideoKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${currentVideoKey}`
    : null;

  return (
    <div className="relative h-[60vh] sm:h-[75vh] lg:h-[85vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Video Trailer Background */}
          {currentVideoKey && trailerUrl ? (
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                src={trailerUrl}
                className="absolute top-1/2 left-1/2 w-[300vw] h-[300vh] min-w-[300vw] min-h-[300vh] -translate-x-1/2 -translate-y-1/2"
                allow="autoplay; encrypted-media"
                style={{ pointerEvents: 'none' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            </div>
          ) : backdropUrl && !imageError ? (
            <>
              <Image
                src={backdropUrl}
                alt={currentMovie.title || 'Movie'}
                fill
                className="object-cover"
                priority
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-end sm:items-center">
        <div className="px-4 sm:px-8 lg:px-16 w-full sm:max-w-2xl pb-24 sm:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="hidden sm:flex items-center gap-2 mb-3">
                <span className="text-red-500 font-bold text-xs sm:text-sm uppercase tracking-wider">
                  B L I T A R F L I X
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg line-clamp-2">
                {currentMovie.title}
              </h1>
              
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                  {Math.round(currentMovie.vote_average * 10)}% Match
                </span>
                <span className="text-white/80 font-medium text-sm sm:text-base">
                  {currentMovie.release_date?.split('-')[0] || 'N/A'}
                </span>
                <span className="text-white/60 border border-white/40 text-xs px-2 py-1 rounded">
                  HD
                </span>
              </div>

              <p className="text-white/80 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 hidden sm:block">
                {currentMovie.overview}
              </p>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link href={`/movie/${currentMovie.id}`}>
                  <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base touch-manipulation">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                    <span>Play</span>
                  </button>
                </Link>
                <Link href={`/movie/${currentMovie.id}`}>
                  <button className="flex items-center gap-2 bg-zinc-700/80 hover:bg-zinc-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium border border-zinc-600 text-sm sm:text-base touch-manipulation">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">More Info</span>
                    <span className="sm:hidden">Info</span>
                  </button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mute button - only show when video is playing */}
      {currentVideoKey && (
        <button
          className="hidden sm:flex absolute right-4 lg:right-8 bottom-32 h-10 w-10 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white items-center justify-center"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}

      {/* Dots indicator */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all touch-manipulation ${
                index === currentIndex
                  ? 'bg-red-600 w-6'
                  : 'bg-white/30 w-2 hover:bg-white/50'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setImageError(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============ MOVIE CARD COMPONENT ============
interface MovieCardProps {
  movie: TMDBMovie;
  mediaType?: 'movie' | 'tv';
}

function MovieCard({ movie, mediaType = 'movie' }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);

  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path, 'poster', 'medium')
    : null;

  const title = movie.title || (movie as { name?: string }).name || 'Untitled';
  const releaseYear = movie.release_date?.split('-')[0] || 
    (movie as { first_air_date?: string }).first_air_date?.split('-')[0] || 'N/A';
  const detailUrl = mediaType === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <Link href={detailUrl} className="flex-shrink-0">
      <div className="relative w-[120px] sm:w-[150px] md:w-[170px] lg:w-[190px] cursor-pointer group">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 shadow-md group-hover:shadow-xl group-hover:shadow-red-900/20 transition-all">
          {posterUrl && !imageError ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, (max-width: 1024px) 170px, 190px"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
              <span className="text-zinc-400 text-xs text-center px-2">{title}</span>
            </div>
          )}

          {/* Media Type Badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded ${
              mediaType === 'tv' 
                ? 'bg-blue-600 text-white' 
                : 'bg-red-600 text-white'
            }`}>
              {mediaType === 'tv' ? 'TV' : 'Movie'}
            </span>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Info overlay on hover/desktop */}
          <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-xs text-white">
              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                {Math.round(movie.vote_average * 10)}%
              </span>
              <span className="text-gray-300">{releaseYear}</span>
            </div>
          </div>

          {/* Play icon on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-12 w-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
              <Play className="h-6 w-6 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs sm:text-sm font-medium text-gray-300 truncate">{title}</p>
      </div>
    </Link>
  );
}

// ============ MOVIE ROW COMPONENT ============
function MovieRow({ title, movies }: { title: string; movies: TMDBMovie[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkArrows();
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkArrows, 300);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="py-3 sm:py-4">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 px-3 sm:px-8 lg:px-16">
        {title}
      </h2>
      
      <div className="relative group/row">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-800/90 shadow-lg opacity-100 sm:opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center touch-manipulation text-white"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-3 sm:px-8 lg:px-16 pb-2 -webkit-overflow-scrolling-touch"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={checkArrows}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-800/90 shadow-lg opacity-100 sm:opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center touch-manipulation text-white"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============ TRENDING TYPE FILTER COMPONENT ============
function TrendingTypeFilter({ activeType, onTypeChange }: { activeType: 'movie' | 'tv'; onTypeChange: (type: 'movie' | 'tv') => void }) {
  return (
    <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-lg w-fit">
      <button
        type="button"
        onClick={() => onTypeChange('movie')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          activeType === 'movie'
            ? 'bg-red-600 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Movies
      </button>
      <button
        type="button"
        onClick={() => onTypeChange('tv')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          activeType === 'tv'
            ? 'bg-red-600 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        TV Shows
      </button>
    </div>
  );
}

// ============ TRENDING ROW COMPONENT ============
function TrendingRow({ movies, mediaType }: { movies: TMDBMovie[]; mediaType: 'movie' | 'tv' }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkArrows();
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkArrows, 300);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative group/row">
      {showLeftArrow && (
        <button
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-800/90 shadow-lg opacity-100 sm:opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center touch-manipulation text-white"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}

      <div
        ref={rowRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-3 sm:px-8 lg:px-16 pb-2 -webkit-overflow-scrolling-touch"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={checkArrows}
      >
        {movies.map((movie) => (
          <MovieCard key={`${mediaType}-${movie.id}`} movie={movie} mediaType={mediaType} />
        ))}
      </div>

      {showRightArrow && (
        <button
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-800/90 shadow-lg opacity-100 sm:opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center touch-manipulation text-white"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}
    </div>
  );
}

// ============ PLATFORM FILTER COMPONENT ============
function PlatformFilter({ activePlatform, onPlatformChange }: { activePlatform: string; onPlatformChange: (platform: string) => void }) {
  const platforms = [
    { id: 'all', name: 'All' },
    { id: 'netflix', name: 'Netflix' },
    { id: 'prime', name: 'Prime Video' },
    { id: 'disney', name: 'Disney+' },
    { id: 'hbo', name: 'HBO Max' },
    { id: 'apple', name: 'Apple TV+' },
    { id: 'paramount', name: 'Paramount+' },
  ];

  return (
    <div className="py-3 sm:py-4 px-3 sm:px-8 lg:px-16">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Platform</h2>
      
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -webkit-overflow-scrolling-touch">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => onPlatformChange(platform.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all touch-manipulation ${
              activePlatform === platform.id
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <span>{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ GENRE FILTER COMPONENT ============
function GenreFilter({ activeGenre, onGenreChange }: { activeGenre: number | null; onGenreChange: (genreId: number | null) => void }) {
  const genres = [
    { id: null, name: 'All' },
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 27, name: 'Horror' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Sci-Fi' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ];

  return (
    <div className="py-3 sm:py-4 px-3 sm:px-8 lg:px-16">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Genre</h2>
      
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -webkit-overflow-scrolling-touch">
        {genres.map((genre) => (
          <button
            key={genre.id ?? 'all'}
            type="button"
            onClick={() => onGenreChange(genre.id)}
            className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all touch-manipulation ${
              activeGenre === genre.id
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ SEARCH RESULTS COMPONENT ============
function SearchResults({ movies, query }: { movies: TMDBMovie[]; query: string }) {
  if (!query) return null;

  return (
    <div className="min-h-[60vh] px-3 sm:px-8 lg:px-16 py-6 sm:py-8 pt-20 sm:pt-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
        Search results for &quot;{query}&quot;
      </h2>
      
      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-base sm:text-lg">No results found for &quot;{query}&quot;</p>
          <p className="text-gray-500 text-sm mt-2">Try searching with different keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============ FOOTER COMPONENT ============
function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto py-6 sm:py-8">
      <div className="px-4 sm:px-8 lg:px-16 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-2 sm:mb-3">BlitarFlix</h3>
        <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto mb-2 sm:mb-3 px-4">
          This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
        </p>
        <a href="mailto:contact@blitarflix.com" className="text-gray-400 text-xs sm:text-sm hover:text-red-500 transition-colors">
          contact@blitarflix.com
        </a>
      </div>
    </footer>
  );
}

// ============ MAIN HOME PAGE ============
export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState<TMDBMovie[]>([]);
  const [trendingTV, setTrendingTV] = useState<TMDBMovie[]>([]);
  const [top10Today, setTop10Today] = useState<TMDBMovie[]>([]);
  const [platformMovies, setPlatformMovies] = useState<TMDBMovie[]>([]);
  const [genreMovies, setGenreMovies] = useState<TMDBMovie[]>([]);
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState('all');
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [trendingType, setTrendingType] = useState<'movie' | 'tv'>('movie');

  // Platform to genre mapping
  const platformGenreMap: Record<string, number> = {
    netflix: 35,
    prime: 28,
    disney: 16,
    hbo: 18,
    apple: 878,
    paramount: 12,
  };

  // Fetch all movie data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [trendingRes, trendingTVRes, popularRes] = await Promise.all([
          fetch('/api/movies/trending'),
          fetch('/api/movies/trending-tv'),
          fetch('/api/movies/popular'),
        ]);

        const [trending, trendingTVData, popular] = await Promise.all([
          trendingRes.json(),
          trendingTVRes.json(),
          popularRes.json(),
        ]);

        setTrendingMovies(trending.results || []);
        setTrendingTV(trendingTVData.results || []);
        
        const allContent = [...(trending.results || []), ...(popular.results || [])];
        const uniqueContent = Array.from(
          new Map(allContent.map(item => [item.id, item])).values()
        );
        const top10 = uniqueContent
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10);
        setTop10Today(top10);
        
        setPlatformMovies(popular.results || []);
        setGenreMovies(popular.results || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Fetch platform content when platform changes
  useEffect(() => {
    const fetchPlatformContent = async () => {
      if (activePlatform === 'all') {
        const res = await fetch('/api/movies/popular');
        const data = await res.json();
        setPlatformMovies(data.results || []);
      } else {
        const genreId = platformGenreMap[activePlatform];
        if (genreId) {
          const res = await fetch(`/api/movies/genre/${genreId}`);
          const data = await res.json();
          setPlatformMovies(data.results || []);
        }
      }
    };

    if (!loading) {
      fetchPlatformContent();
    }
  }, [activePlatform, loading]);

  // Fetch genre content when genre changes
  useEffect(() => {
    const fetchGenreContent = async () => {
      if (activeGenre === null) {
        const res = await fetch('/api/movies/popular');
        const data = await res.json();
        setGenreMovies(data.results || []);
      } else {
        const res = await fetch(`/api/movies/genre/${activeGenre}`);
        const data = await res.json();
        setGenreMovies(data.results || []);
      }
    };

    if (!loading) {
      fetchGenreContent();
    }
  }, [activeGenre, loading]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearchResults([]);
    }
  }, []);

  const getPlatformTitle = (platform: string) => {
    const names: Record<string, string> = {
      all: 'All Platforms',
      netflix: 'Netflix',
      prime: 'Prime Video',
      disney: 'Disney+',
      hbo: 'HBO Max',
      apple: 'Apple TV+',
      paramount: 'Paramount+',
    };
    return names[platform] || platform;
  };

  const getGenreTitle = (genreId: number | null) => {
    if (!genreId) return 'All Genres';
    const names: Record<number, string> = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
      99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
      27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
      53: 'Thriller', 10752: 'War', 37: 'Western',
    };
    return names[genreId] || 'Selected Genre';
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header onSearch={handleSearch} isScrolled={isScrolled} />
      
      <main className="flex-1 pt-14 sm:pt-16">
        {trendingMovies.length > 0 && !searchQuery && (
          <HeroSection movies={trendingMovies} />
        )}

        {searchQuery ? (
          <SearchResults movies={searchResults} query={searchQuery} />
        ) : (
          <div className="relative z-10 -mt-16 sm:-mt-20">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : (
              <>
                {top10Today.length > 0 && (
                  <MovieRow title="Top 10 Content Today" movies={top10Today} />
                )}

                <div className="py-3 sm:py-4">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 px-3 sm:px-8 lg:px-16">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Trending Today</h2>
                    <TrendingTypeFilter 
                      activeType={trendingType} 
                      onTypeChange={setTrendingType} 
                    />
                  </div>
                  <TrendingRow 
                    movies={trendingType === 'movie' ? trendingMovies : trendingTV} 
                    mediaType={trendingType} 
                  />
                </div>

                <PlatformFilter 
                  activePlatform={activePlatform} 
                  onPlatformChange={setActivePlatform} 
                />
                
                {platformMovies.length > 0 && (
                  <MovieRow title={getPlatformTitle(activePlatform)} movies={platformMovies} />
                )}

                <GenreFilter 
                  activeGenre={activeGenre} 
                  onGenreChange={setActiveGenre} 
                />

                {genreMovies.length > 0 && (
                  <MovieRow title={getGenreTitle(activeGenre)} movies={genreMovies} />
                )}
              </>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
