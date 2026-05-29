'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { getImageUrl, TMDBTVShow } from '@/lib/tmdb';
import { SkeletonGrid } from '@/components/skeletons/SkeletonGrid';
import { useTranslation } from '@/lib/i18n/LanguageContext';

function TVBrowsePageContent() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get('genre') || 'all';
  const { tt } = useTranslation();

  const GENRES = [
    { id: 'all', name: tt('genres.allGenres') },
    { id: 10759, name: tt('genres.actionAdventure') },
    { id: 16, name: tt('genres.animation') },
    { id: 35, name: tt('genres.comedy') },
    { id: 80, name: tt('genres.crime') },
    { id: 99, name: tt('genres.documentary') },
    { id: 18, name: tt('genres.drama') },
    { id: 10751, name: tt('genres.family') },
    { id: 10762, name: tt('genres.kids') },
    { id: 9648, name: tt('genres.mystery') },
    { id: 10763, name: tt('genres.news') },
    { id: 10764, name: tt('genres.reality') },
    { id: 10765, name: tt('genres.sciFiFantasy') },
    { id: 10766, name: tt('genres.soap') },
    { id: 10767, name: tt('genres.talk') },
    { id: 10768, name: tt('genres.warPolitics') },
    { id: 37, name: tt('genres.western') },
  ];
  const [activeGenre, setActiveGenre] = useState(genreParam);
  const [tvShows, setTVShows] = useState<TMDBTVShow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setPage(1);
    setTVShows([]);
    setSearchQuery('');
    setIsSearching(false);
  }, [activeGenre]);

  useEffect(() => {
    async function fetchTVShows() {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        let endpoint = '/api/tv/trending';
        const params = new URLSearchParams();
        
        // If searching, use search endpoint
        if (isSearching && searchQuery) {
          endpoint = '/api/tv/search';
          params.append('query', searchQuery);
        } else {
          // Add genre filter if selected
          if (activeGenre !== 'all') {
            params.append('genre', activeGenre);
          }
        }
        
        params.append('page', page.toString());
        
        const res = await fetch(`${endpoint}?${params}`);
        const data = await res.json();

        const results = data.results || [];
        
        if (page === 1) {
          setTVShows(results);
        } else {
          setTVShows(prev => [...prev, ...results]);
        }

        setTotalPages(Math.min(data.total_pages || 1, 50));
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }

    fetchTVShows();
  }, [activeGenre, page, isSearching, searchQuery]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loadingMore && !loading) {
          setPage(p => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [page, totalPages, loadingMore, loading]);

  const getGenreName = () => {
    const genre = GENRES.find(g => g.id.toString() === activeGenre);
    return genre?.name || 'All Genres';
  };

  const updateURL = (genre: string) => {
    const params = new URLSearchParams();
    if (genre !== 'all') params.append('genre', genre);
    
    const queryString = params.toString();
    const newURL = queryString ? `/browse/tv?${queryString}` : '/browse/tv';
    window.history.pushState({}, '', newURL);
  };

  const handleGenreChange = (genreId: string) => {
    setActiveGenre(genreId);
    updateURL(genreId);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setIsSearching(true);
      setSearchQuery(query);
      setPage(1);
      setTVShows([]);
    } else {
      setIsSearching(false);
      setSearchQuery('');
      setPage(1);
      setTVShows([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header onSearch={handleSearch} isScrolled={isScrolled} />

      <main className="flex-1 pt-20 sm:pt-24 px-3 sm:px-8 lg:px-16 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {isSearching ? `${tt('search.search')}: "${searchQuery}"` : tt('browse.tvShows')}
            </h1>
            <p className="text-zinc-400 text-sm">
              {isSearching ? tt('search.resultsFor') : getGenreName()}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {showFilters ? tt('browse.hideFilters') : tt('browse.showFilters')}
          </button>
        </div>

        {/* Filters - hide when searching */}
        {!isSearching && (
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block mb-6`}>
            {/* Genre Filters */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">{tt('sections.genre')}</h3>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -webkit-overflow-scrolling-touch">
                {GENRES.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreChange(genre.id.toString())}
                    className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all touch-manipulation ${
                      activeGenre === genre.id.toString()
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <SkeletonGrid count={12} showFilterPlaceholders={!isSearching} />
        ) : tvShows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">{tt('browse.noTVShowsFound')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
            {tvShows.map((tvShow, idx) => (
              <TVCard key={`${tvShow.id}-${idx}`} tvShow={tvShow} />
            ))}
          </div>
        )}

        <div ref={loadMoreRef} className="flex items-center justify-center py-8">
          {loadingMore && <Loader2 className="h-6 w-6 animate-spin text-red-500" />}
          {page >= totalPages && tvShows.length > 0 && (
            <p className="text-zinc-500 text-sm">{tt('browse.noMoreTVShows')}</p>
          )}
        </div>
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto py-6">
        <div className="text-center px-4">
          <h3 className="text-lg font-bold text-red-600 mb-2">BlitarFlix</h3>
          <p className="text-zinc-500 text-xs">{tt('footer.disclaimer')}</p>
        </div>
      </footer>
    </div>
  );
}

export default function TVBrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-950"><Loader2 className="h-8 w-8 animate-spin text-red-500" /></div>}>
      <TVBrowsePageContent />
    </Suspense>
  );
}

function TVCard({ tvShow }: { tvShow: TMDBTVShow }) {
  const [imageError, setImageError] = useState(false);
  const { tt } = useTranslation();

  const posterUrl = tvShow.poster_path
    ? getImageUrl(tvShow.poster_path, 'poster', 'medium')
    : null;

  const title = tvShow.name || tt('card.untitled');
  const releaseYear = tvShow.first_air_date?.split('-')[0] || tt('card.na');

  return (
    <Link href={`/tv/${tvShow.id}`}>
      <div className="cursor-pointer group">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 shadow-md group-hover:shadow-xl group-hover:shadow-red-900/20 transition-all">
          {posterUrl && !imageError ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
              <span className="text-zinc-400 text-xs text-center px-2">{title}</span>
            </div>
          )}

          <div className="absolute top-2 left-2 z-10">
            <span className="text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded bg-blue-600 text-white">
              {tt('card.tv')}
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-xs text-white">
              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                {Math.round(tvShow.vote_average * 10)}%
              </span>
              <span className="text-gray-300">{releaseYear}</span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs sm:text-sm font-medium text-gray-300 truncate">{title}</p>
      </div>
    </Link>
  );
}