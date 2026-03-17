'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { getImageUrl, TMDBMovie } from '@/lib/tmdb';

const GENRE_NAMES: Record<string, string> = {
  'all': 'All',
  '28': 'Action',
  '12': 'Adventure',
  '16': 'Animation',
  '35': 'Comedy',
  '80': 'Crime',
  '99': 'Documentary',
  '18': 'Drama',
  '10751': 'Family',
  '14': 'Fantasy',
  '27': 'Horror',
  '9648': 'Mystery',
  '10749': 'Romance',
  '878': 'Sci-Fi',
  '53': 'Thriller',
  '10752': 'War',
  '37': 'Western',
};

const PLATFORM_NAMES: Record<string, string> = {
  'all': 'All Platforms',
  'netflix': 'Netflix',
  'prime': 'Prime Video',
  'disney': 'Disney+',
  'hbo': 'HBO Max',
  'apple': 'Apple TV+',
  'paramount': 'Paramount+',
};

export default function GenreBrowsePage({ params }: { params: Promise<{ genreId: string }> }) {
  const [genreId, setGenreId] = useState<string>('');
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.then(p => setGenreId(p.genreId));
  }, [params]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      if (!genreId) return;
      
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const res = await fetch(`/api/movies/platform/${genreId}?page=${page}`);
        const data = await res.json();

        const results = data.results || [];
        
        if (page === 1) {
          setMovies(results);
        } else {
          setMovies(prev => [...prev, ...results]);
        }

        setTotalPages(Math.min(data.total_pages || 1, 50));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }

    fetchMovies();
  }, [genreId, page]);

  const genreName = GENRE_NAMES[genreId] || 'Movies';

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header isScrolled={isScrolled} />

      <main className="flex-1 pt-20 sm:pt-24 px-3 sm:px-8 lg:px-16 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          {genreName} Movies
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
            {movies.map((movie, idx) => (
              <MovieCard key={`${movie.id}-${idx}`} movie={movie} />
            ))}
          </div>
        )}

        <div ref={loadMoreRef} className="flex items-center justify-center py-8">
          {loadingMore && <Loader2 className="h-6 w-6 animate-spin text-red-500" />}
          {page >= totalPages && movies.length > 0 && (
            <p className="text-zinc-500 text-sm">No more movies</p>
          )}
        </div>
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto py-6">
        <div className="text-center px-4">
          <h3 className="text-lg font-bold text-red-600 mb-2">BlitarFlix</h3>
          <p className="text-zinc-500 text-xs">This site does not store any files.</p>
        </div>
      </footer>
    </div>
  );
}

function MovieCard({ movie }: { movie: TMDBMovie }) {
  const [imageError, setImageError] = useState(false);

  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path, 'poster', 'medium')
    : null;

  const title = movie.title || 'Untitled';
  const releaseYear = movie.release_date?.split('-')[0] || 'N/A';

  return (
    <Link href={`/movie/${movie.id}`}>
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
            <span className="text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded bg-red-600 text-white">
              Movie
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-xs text-white">
              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                {Math.round(movie.vote_average * 10)}%
              </span>
              <span className="text-gray-300">{releaseYear}</span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs sm:text-sm font-medium text-gray-300 truncate">{title}</p>
      </div>
    </Link>
  );
}
