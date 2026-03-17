'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { getImageUrl, TMDBMovie } from '@/lib/tmdb';

const GENRE_NAMES: Record<string, string> = {
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

export default function GenreBrowsePage({ params }: { params: Promise<{ genreId: string }> }) {
  const [genreId, setGenreId] = useState<string>('');
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.then(p => setGenreId(p.genreId));
  }, [params]);

  // Fetch movies
  const fetchMovies = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await fetch(`/api/movies/genre/${genreId}?page=${pageNum}`);
      const data = await res.json();

      if (append) {
        setMovies(prev => [...prev, ...data.results]);
      } else {
        setMovies(data.results || []);
      }

      setHasMore(pageNum < data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [genreId]);

  // Initial fetch
  useEffect(() => {
    if (genreId) {
      setPage(1);
      setMovies([]);
      setHasMore(true);
      fetchMovies(1);
    }
  }, [genreId, fetchMovies]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMovies(nextPage, true);
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loading, page, fetchMovies]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const genreName = GENRE_NAMES[genreId] || 'Genre';

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header isScrolled={isScrolled} />

      <main className="flex-1 pt-14 sm:pt-16 px-3 sm:px-8 lg:px-16 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">
          {genreName} Movies
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
              {movies.map((movie) => (
                <MovieCard key={`${movie.id}-${movie.release_date}`} movie={movie} />
              ))}
            </div>

            {/* Load more trigger */}
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {loadingMore && (
                <Loader2 className="h-8 w-8 animate-spin text-red-500" />
              )}
              {!hasMore && movies.length > 0 && (
                <p className="text-zinc-500 text-sm">No more movies to load</p>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto py-6 sm:py-8">
        <div className="px-4 sm:px-8 lg:px-16 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-2 sm:mb-3">BlitarFlix</h3>
          <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto mb-2 sm:mb-3 px-4">
            This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
          </p>
          <a href="mailto:contact@blitarflix.com" className="text-zinc-400 text-xs sm:text-sm hover:text-red-500 transition-colors">
            contact@blitarflix.com
          </a>
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
    <Link href={`/movie/${movie.id}`} className="flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative cursor-pointer group"
      >
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

          {/* Movie Badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded bg-red-600 text-white">
              Movie
            </span>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Info overlay on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
      </motion.div>
    </Link>
  );
}
