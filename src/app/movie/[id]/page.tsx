'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Star, Calendar, Clock, Volume2, VolumeX } from 'lucide-react';
import { Header } from '@/components/Header';
import { SecureVideoPlayer } from '@/components/SecureVideoPlayer';
import { useMyList } from '@/hooks/useMyList';
import { getImageUrl, TMDBMovieDetails, TMDBVideo } from '@/lib/tmdb';

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;
  
  const [movie, setMovie] = useState<TMDBMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const { isInList, toggleItem } = useMyList();
  
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/movies/${movieId}`);
        if (!res.ok) {
          throw new Error('Movie not found');
        }
        const data = await res.json();
        setMovie(data);
        if (data.videos?.results?.length > 0) {
          const trailer = data.videos.results.find(
            (v: TMDBVideo) => v.type === 'Trailer' && v.site === 'YouTube'
          );
          if (trailer) {
            setIsVideoPlaying(true);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movie');
      } finally {
        setLoading(false);
      }
    };
    
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trailer = movie?.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const playerUrl = movie 
    ? `https://www.vidking.net/embed/movie/${movie.id}?color=e50914&autoPlay=true`
    : null;

  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailer.key}`
    : null;

  const handleMyListClick = () => {
    if (!movie) return;
    toggleItem({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview,
      type: 'movie',
    });
  };

  const isInMyList = movie ? isInList(movie.id, 'movie') : false;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950">
        <Header isScrolled={true} showSearch={false} />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950">
        <Header isScrolled={true} showSearch={false} />
        <div className="flex-1 flex items-center justify-center pt-14 sm:pt-16 px-4">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">
              {error || 'Movie not found'}
            </h1>
            <button
              onClick={() => router.push('/')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm sm:text-base"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? getImageUrl(movie.backdrop_path, 'backdrop', 'original')
    : null;
  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path, 'poster', 'large')
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Secure Video Player Modal */}
      {isPlayerVisible && playerUrl && (
        <SecureVideoPlayer
          url={playerUrl}
          onClose={() => setIsPlayerVisible(false)}
          title={movie.title}
        />
      )}

      {/* Header - hidden when player is visible */}
      {!isPlayerVisible && <Header isScrolled={isScrolled} showSearch={false} />}

      {/* Hero Section */}
      <div className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh]">
        {/* Video/Image Background */}
        <div className="absolute inset-0 overflow-hidden">
          {isVideoPlaying && trailerUrl ? (
            <iframe
              src={trailerUrl}
              className="absolute top-1/2 left-1/2 w-[300vw] h-[300vh] min-w-[300vw] min-h-[300vh] -translate-x-1/2 -translate-y-1/2"
              allow="autoplay; encrypted-media"
              style={{ pointerEvents: 'none' }}
            />
          ) : backdropUrl ? (
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
          )}
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-end">
          <div className="w-full px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-end lg:items-end">
              {/* Poster */}
              <div className="flex-shrink-0 hidden sm:block">
                <div className="relative w-36 sm:w-44 lg:w-52 xl:w-60 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-zinc-700">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                      <span className="text-zinc-400">No Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Movie Info */}
              <div className="flex-1 pb-4 lg:pb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg line-clamp-2">
                  {movie.title}
                </h1>

                <div className="flex items-center flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-semibold text-lg">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-zinc-400 text-sm">({movie.vote_count.toLocaleString()})</span>
                  </div>
                  {movie.release_date && (
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">{movie.release_date.split('-')[0]}</span>
                    </div>
                  )}
                  {movie.runtime && (
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                    </div>
                  )}
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
                    {movie.genres.map((genre) => (
                      <span key={genre.id} className="bg-zinc-700/80 text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <button
                    onClick={() => setIsPlayerVisible(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base touch-manipulation shadow-lg"
                  >
                    <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />
                    Play Now
                  </button>
                  <button 
                    onClick={handleMyListClick}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold transition-colors text-sm sm:text-base touch-manipulation ${
                      isInMyList 
                        ? 'bg-zinc-700 text-white ring-1 ring-zinc-600' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white ring-1 ring-zinc-600'
                    }`}
                  >
                    {isInMyList ? (
                      <>
                        <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="hidden sm:inline">In My List</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="hidden sm:inline">My List</span>
                      </>
                    )}
                  </button>
                </div>

                {movie.tagline && (
                  <p className="text-base sm:text-lg italic text-zinc-400 mb-3 sm:mb-4">
                    &quot;{movie.tagline}&quot;
                  </p>
                )}

                <p className="text-zinc-300 leading-relaxed max-w-3xl text-sm sm:text-base lg:text-lg line-clamp-3 lg:line-clamp-4">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>
            </div>
          </div>

          {/* Mute/Unmute button */}
          {isVideoPlaying && trailerUrl && (
            <button
              className="absolute right-4 sm:right-8 bottom-4 sm:bottom-8 h-11 w-11 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white flex items-center justify-center"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Cast */}
      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <section className="px-3 sm:px-8 lg:px-16 py-6 sm:py-8 bg-zinc-950">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Cast</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {movie.credits.cast.slice(0, 12).map((person) => (
              <div 
                key={person.id} 
                className="flex items-center gap-2 sm:gap-3 bg-zinc-900/80 rounded-full pr-3 sm:pr-4 ring-1 ring-zinc-800 hover:ring-zinc-700 transition-colors"
              >
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
                  {person.profile_path ? (
                    <Image
                      src={getImageUrl(person.profile_path, 'profile', 'medium')!}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-700 flex items-center justify-center">
                      <span className="text-zinc-500 text-xs font-medium">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="py-1.5 sm:py-2 pr-1">
                  <p className="font-medium text-white text-xs sm:text-sm leading-tight truncate max-w-[100px] sm:max-w-[140px]">{person.name}</p>
                  <p className="text-zinc-500 text-[10px] sm:text-xs truncate max-w-[100px] sm:max-w-[140px]">{person.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar Movies */}
      {movie.similar?.results && movie.similar.results.length > 0 && (
        <section className="px-3 sm:px-8 lg:px-16 py-6 sm:py-8 bg-zinc-950">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Similar Movies</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
            {movie.similar.results.slice(0, 6).map((similarMovie) => (
              <Link
                key={similarMovie.id}
                href={`/movie/${similarMovie.id}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 shadow-md group-hover:shadow-xl group-hover:shadow-red-900/20 transition-shadow ring-1 ring-zinc-700">
                  {similarMovie.poster_path ? (
                    <Image
                      src={getImageUrl(similarMovie.poster_path, 'poster', 'medium')!}
                      alt={similarMovie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-zinc-500 text-xs text-center px-2">
                        {similarMovie.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs sm:text-sm font-medium truncate">
                      {similarMovie.title}
                    </p>
                    <p className="text-zinc-400 text-xs hidden sm:block">
                      {similarMovie.release_date?.split('-')[0]}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
