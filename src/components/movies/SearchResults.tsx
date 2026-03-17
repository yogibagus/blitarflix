'use client';

import { TMDBMovie } from '@/lib/tmdb';
import { MovieCard } from './MovieCard';

interface SearchResultsProps {
  movies: TMDBMovie[];
  query: string;
}

export function SearchResults({ movies, query }: SearchResultsProps) {
  if (!query) return null;

  return (
    <div className="min-h-[60vh] px-4 sm:px-8 lg:px-16 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Search results for &quot;{query}&quot;
      </h2>
      
      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No results found for &quot;{query}&quot;</p>
          <p className="text-gray-400 text-sm mt-2">
            Try searching with different keywords
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} mediaType="movie" />
          ))}
        </div>
      )}
    </div>
  );
}
