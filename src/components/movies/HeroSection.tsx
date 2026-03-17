'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getImageUrl, TMDBMovie } from '@/lib/tmdb';

interface HeroSectionProps {
  movies: TMDBMovie[];
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [imageError, setImageError] = useState(false);

  const featuredMovies = movies.slice(0, 5);
  const currentMovie = featuredMovies[currentIndex];

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
      setImageError(false);
    }, 8000);

    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (!currentMovie) return null;

  const backdropUrl = currentMovie.backdrop_path
    ? getImageUrl(currentMovie.backdrop_path, 'backdrop', 'original')
    : null;

  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {backdropUrl && !imageError ? (
            <Image
              src={backdropUrl}
              alt={currentMovie.title || 'Movie'}
              fill
              className="object-cover"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
          )}
          
          {/* Dark gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="px-4 sm:px-8 lg:px-16 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* BlitarFlix Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500 font-bold text-sm uppercase tracking-wider">
                  B L I T A R F L I X
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {currentMovie.title}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-green-500 text-white hover:bg-green-600">
                  {Math.round(currentMovie.vote_average * 10)}% Match
                </Badge>
                <span className="text-white/80 font-medium">
                  {currentMovie.release_date?.split('-')[0] || 'N/A'}
                </span>
                <Badge variant="outline" className="border-white/40 text-white">
                  HD
                </Badge>
              </div>

              <p className="text-white/80 text-sm sm:text-base lg:text-lg mb-6 line-clamp-3 sm:line-clamp-4">
                {currentMovie.overview}
              </p>

              <div className="flex items-center gap-3">
                <Link href={`/movie/${currentMovie.id}`}>
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white gap-2"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Play
                  </Button>
                </Link>
                <Link href={`/movie/${currentMovie.id}`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/40 gap-2"
                  >
                    <Info className="h-5 w-5" />
                    More Info
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Volume Control */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 sm:right-8 bottom-32 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>

      {/* Slide Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-red-600 w-6'
                  : 'bg-white/50 hover:bg-white/70'
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
