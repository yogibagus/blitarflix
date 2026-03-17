'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GenreFilterProps {
  activeGenre: number | null;
  onGenreChange: (genreId: number | null) => void;
}

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

export function GenreFilter({ activeGenre, onGenreChange }: GenreFilterProps) {
  return (
    <div className="py-4 px-4 sm:px-8 lg:px-16">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
        Genre
      </h2>
      
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {genres.map((genre) => (
          <motion.button
            key={genre.id ?? 'all'}
            onClick={() => onGenreChange(genre.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeGenre === genre.id
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {genre.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
