'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, ThumbsUp } from 'lucide-react';
import { getImageUrl, TMDBMovie } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MovieCardProps {
  movie: TMDBMovie;
  mediaType?: 'movie' | 'tv';
}

export function MovieCard({ movie, mediaType = 'movie' }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path, 'poster', 'medium')
    : null;

  const detailUrl = mediaType === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const title = movie.title || (movie as { name?: string }).name || 'Untitled';
  const releaseYear = movie.release_date?.split('-')[0] || 
    (movie as { first_air_date?: string }).first_air_date?.split('-')[0] || 'N/A';

  return (
    <Link href={detailUrl}>
      <motion.div
        className="relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 shadow-md">
          {posterUrl && !imageError ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 200px"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-gray-400 text-sm text-center px-2">{title}</span>
            </div>
          )}

          {/* Overlay on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
          />

          {/* Hover content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute bottom-0 left-0 right-0 p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-white text-gray-900 hover:bg-gray-200"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Play className="h-4 w-4 fill-current" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full border-white/40 bg-gray-800/60 text-white hover:bg-gray-700/60"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full border-white/40 bg-gray-800/60 text-white hover:bg-gray-700/60"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-white">
              <Badge variant="secondary" className="bg-green-500 text-white text-xs px-1.5 py-0.5">
                {Math.round(movie.vote_average * 10)}%
              </Badge>
              <span className="text-gray-300">
                {releaseYear}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Title (visible when not hovered) */}
        {!isHovered && (
          <p className="mt-2 text-sm font-medium text-gray-800 truncate">{title}</p>
        )}
      </motion.div>
    </Link>
  );
}
