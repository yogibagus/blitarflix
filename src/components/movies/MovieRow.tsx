'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from './MovieCard';
import { TMDBMovie } from '@/lib/tmdb';

interface MovieRowProps {
  title: string;
  movies: TMDBMovie[];
  mediaType?: 'movie' | 'tv';
}

export function MovieRow({ title, movies, mediaType = 'movie' }: MovieRowProps) {
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
    const handleResize = () => checkArrows();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkArrows, 300);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="py-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 px-4 sm:px-8 lg:px-16">
        {title}
      </h2>
      
      <div className="relative group/row">
        {/* Left Arrow */}
        {showLeftArrow && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 shadow-lg opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Movies Container */}
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-8 lg:px-16 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={checkArrows}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} mediaType={mediaType} />
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 shadow-lg opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
