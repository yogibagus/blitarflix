'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Play } from 'lucide-react';
import { Header } from '@/components/Header';
import { useMyList, MyListItem } from '@/hooks/useMyList';
import { getImageUrl } from '@/lib/tmdb';

export default function MyListPage() {
  const { myList, isLoaded, removeFromList } = useMyList();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRemove = (id: number, type: 'movie' | 'tv') => {
    removeFromList(id, type);
  };

  // Sort by addedAt (most recent first)
  const sortedList = [...myList].sort((a, b) => b.addedAt - a.addedAt);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header isScrolled={isScrolled} showSearch={false} />
      
      <main className="flex-1 pt-20 sm:pt-24 pb-6 sm:pb-8 px-3 sm:px-8 lg:px-16">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">My List</h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            {isLoaded ? `${myList.length} ${myList.length === 1 ? 'item' : 'items'}` : 'Loading...'}
          </p>
        </div>

        {!isLoaded ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : sortedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 sm:h-80 text-center px-4">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Play className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Your list is empty</h2>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">Start adding movies and shows to your list!</p>
            <Link href="/">
              <button className="bg-red-600 hover:bg-red-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base touch-manipulation">
                Browse Content
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
            {sortedList.map((item) => (
              <MyListItemCard 
                key={`${item.type}-${item.id}`} 
                item={item} 
                onRemove={handleRemove} 
              />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 mt-auto py-6 sm:py-8">
        <div className="px-4 sm:px-8 lg:px-16 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-2 sm:mb-3">BlitarFlix</h3>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto mb-2 sm:mb-3 px-4">
            This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
          </p>
          <a href="mailto:contact@blitarflix.com" className="text-gray-600 text-xs sm:text-sm hover:text-red-600 transition-colors">
            contact@blitarflix.com
          </a>
        </div>
      </footer>
    </div>
  );
}

function MyListItemCard({ 
  item, 
  onRemove 
}: { 
  item: MyListItem; 
  onRemove: (id: number, type: 'movie' | 'tv') => void;
}) {
  const [imageError, setImageError] = useState(false);

  const posterUrl = item.poster_path
    ? getImageUrl(item.poster_path, 'poster', 'medium')
    : null;

  const title = item.title || 'Untitled';
  const releaseYear = item.release_date?.split('-')[0] || 'N/A';
  const href = item.type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;

  return (
    <div className="relative group">
      <Link href={href}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 shadow-md group-hover:shadow-xl transition-shadow">
          {posterUrl && !imageError ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-gray-400 text-xs text-center px-2">{title}</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Play icon on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5" />
            </div>
          </div>

          {/* Info on hover/desktop */}
          <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-xs text-white">
              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                {Math.round(item.vote_average * 10)}%
              </span>
              <span className="text-gray-300">{releaseYear}</span>
            </div>
          </div>
        </div>
      </Link>

      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-gray-800 truncate">{title}</p>

      {/* Remove button - always visible on mobile, hover on desktop */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(item.id, item.type);
        }}
        className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation hover:bg-red-700"
        aria-label="Remove from list"
      >
        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
    </div>
  );
}
