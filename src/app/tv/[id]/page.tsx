'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Star, Calendar, ChevronDown, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/Header';
import { SecureVideoPlayer } from '@/components/SecureVideoPlayer';
import { SkeletonTVDetail } from '@/components/skeletons/SkeletonTVDetail';
import { useMyList } from '@/hooks/useMyList';
import { getImageUrl, TMDBTVDetails, TMDBSeasonDetails, TMDBEpisode, TMDBVideo } from '@/lib/tmdb';

export default function TVDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tvId = params.id as string;
  
  const [tv, setTV] = useState<TMDBTVDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasonDetails, setSeasonDetails] = useState<TMDBSeasonDetails | null>(null);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showNewContentWarning, setShowNewContentWarning] = useState(false);
  
  const { isInList, toggleItem } = useMyList();

  // Check if content is less than 1 month old
  const isNewContent = (dateStr: string | undefined | null): boolean => {
    if (!dateStr) return false;
    const releaseDate = new Date(dateStr);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return releaseDate > oneMonthAgo;
  };

  const handlePlayClick = () => {
    if (isNewContent(tv?.first_air_date)) {
      setShowNewContentWarning(true);
    } else {
      setIsPlayerVisible(true);
    }
  };

  const handleEpisodeClick = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    if (isNewContent(tv?.first_air_date)) {
      setShowNewContentWarning(true);
    } else {
      setIsPlayerVisible(true);
    }
  };
  
  // Fetch TV details
  useEffect(() => {
    const fetchTV = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tv/${tvId}`);
        if (!res.ok) {
          throw new Error('TV Show not found');
        }
        const data = await res.json();
        setTV(data);
        const firstRealSeason = data.seasons?.find((s: { season_number: number }) => s.season_number > 0);
        if (firstRealSeason) {
          setSelectedSeason(firstRealSeason.season_number);
        }
        if (data.videos?.results?.length > 0) {
          const trailer = data.videos.results.find(
            (v: TMDBVideo) => v.type === 'Trailer' && v.site === 'YouTube'
          );
          if (trailer) {
            setIsVideoPlaying(true);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load TV show');
      } finally {
        setLoading(false);
      }
    };
    
    if (tvId) {
      fetchTV();
    }
  }, [tvId]);

  // Fetch season details when season changes
  useEffect(() => {
    const fetchSeasonDetails = async () => {
      if (!tvId || !selectedSeason) return;
      try {
        const res = await fetch(`/api/tv/${tvId}/season/${selectedSeason}`);
        if (res.ok) {
          const data = await res.json();
          setSeasonDetails(data);
          setEpisodes(data.episodes || []);
          setSelectedEpisode(1);
        }
      } catch (err) {
        console.error('Error fetching season details:', err);
      }
    };
    
    fetchSeasonDetails();
  }, [tvId, selectedSeason]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trailer = tv?.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const playerUrl = tv 
    ? `https://vaplayer.ru/embed/tv/${tv.id}/${selectedSeason}/${selectedEpisode}?color=e50914&autoPlay=true`
    : null;

  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailer.key}`
    : null;

  const handleMyListClick = () => {
    if (!tv) return;
    toggleItem({
      id: tv.id,
      title: tv.name,
      poster_path: tv.poster_path,
      backdrop_path: tv.backdrop_path,
      vote_average: tv.vote_average,
      release_date: tv.first_air_date,
      overview: tv.overview,
      type: 'tv',
    });
  };

  const isInMyList = tv ? isInList(tv.id, 'tv') : false;

  if (loading) {
    return <SkeletonTVDetail />;
  }

  if (error || !tv) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950">
        <Header isScrolled={true} showSearch={false} />
        <div className="flex-1 flex items-center justify-center pt-14 sm:pt-16 px-4">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">
              {error || 'TV Show not found'}
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

  const backdropUrl = tv.backdrop_path
    ? getImageUrl(tv.backdrop_path, 'backdrop', 'large')
    : null;
  const posterUrl = tv.poster_path
    ? getImageUrl(tv.poster_path, 'poster', 'large')
    : null;

  const currentSeason = tv.seasons?.find(s => s.season_number === selectedSeason);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Secure Video Player Modal */}
      {isPlayerVisible && playerUrl && (
        <SecureVideoPlayer
          url={playerUrl}
          onClose={() => setIsPlayerVisible(false)}
          title={`${tv.name} - S${selectedSeason}E${selectedEpisode}`}
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
              alt={tv.name}
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
                      alt={tv.name}
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

              {/* TV Info */}
              <div className="flex-1 pb-4 lg:pb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg line-clamp-2">
                  {tv.name}
                </h1>

                <div className="flex items-center flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-semibold text-lg">{tv.vote_average.toFixed(1)}</span>
                    <span className="text-zinc-400 text-sm">({tv.vote_count.toLocaleString()})</span>
                  </div>
                  {tv.first_air_date && (
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">{tv.first_air_date.split('-')[0]}</span>
                    </div>
                  )}
                  {tv.number_of_seasons && (
                    <span className="text-zinc-300 text-sm sm:text-base">
                      {tv.number_of_seasons} Season{tv.number_of_seasons > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {tv.genres && tv.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
                    {tv.genres.map((genre) => (
                      <span key={genre.id} className="bg-zinc-700/80 text-white px-3 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <button
                    onClick={handlePlayClick}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base touch-manipulation shadow-lg"
                  >
                    <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />
                    Play Now
                  </button>
                  <button 
                    onClick={handleMyListClick}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold backdrop-blur-sm transition-colors text-sm sm:text-base touch-manipulation ${
                      isInMyList 
                        ? 'bg-zinc-700 text-white ring-1 ring-zinc-500' 
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

                {tv.tagline && (
                  <p className="text-base sm:text-lg italic text-zinc-400 mb-3 sm:mb-4">
                    &quot;{tv.tagline}&quot;
                  </p>
                )}

                <p className="text-zinc-300 leading-relaxed max-w-3xl text-sm sm:text-base lg:text-lg line-clamp-3 lg:line-clamp-4">
                  {tv.overview || 'No overview available.'}
                </p>
              </div>
            </div>
          </div>

          {/* Mute/Unmute button */}
          {isVideoPlaying && trailerUrl && (
            <button
              className="absolute right-4 sm:right-8 bottom-4 sm:bottom-8 h-11 w-11 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white flex items-center justify-center backdrop-blur-sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Season & Episode Selector */}
      <div className="px-3 sm:px-8 lg:px-16 py-6 sm:py-8 bg-zinc-950">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
          {/* Season Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSeasonDropdown(!showSeasonDropdown)}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 rounded-lg text-sm sm:text-base font-medium text-white ring-1 ring-zinc-700"
            >
              <span>Season {selectedSeason}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showSeasonDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSeasonDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 z-20 min-w-[150px] max-h-60 overflow-y-auto">
                {tv.seasons?.filter(s => s.season_number > 0).map((season) => (
                  <button
                    key={season.id}
                    onClick={() => {
                      setSelectedSeason(season.season_number);
                      setShowSeasonDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 ${
                      selectedSeason === season.season_number ? 'bg-zinc-700 font-medium text-white' : 'text-zinc-300'
                    }`}
                  >
                    Season {season.season_number}
                  </button>
                ))}
              </div>
            )}
          </div>

          {currentSeason && (
            <div className="text-zinc-400 text-sm">
              {currentSeason.episode_count} Episodes
              {currentSeason.air_date && ` • ${currentSeason.air_date.split('-')[0]}`}
            </div>
          )}
        </div>

        {/* Episode List */}
        <div className="space-y-3">
          {episodes.map((episode) => (
            <button
              key={episode.id}
              onClick={() => handleEpisodeClick(episode.episode_number)}
              className={`w-full flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all text-left ${
                selectedEpisode === episode.episode_number
                  ? 'bg-red-950 border-2 border-red-600'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800'
              }`}
            >
              <div className="flex-shrink-0 w-24 sm:w-32 md:w-40 aspect-video rounded-lg overflow-hidden bg-zinc-800 relative">
                {episode.still_path ? (
                  <Image
                    src={getImageUrl(episode.still_path, 'backdrop', 'small')!}
                    alt={episode.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-600" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white fill-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs sm:text-sm font-medium text-red-500">
                    Episode {episode.episode_number}
                  </span>
                  {episode.runtime && (
                    <span className="text-xs text-zinc-500">{episode.runtime}m</span>
                  )}
                </div>
                <h3 className="font-medium text-white text-sm sm:text-base truncate">{episode.name}</h3>
                <p className="text-zinc-500 text-xs sm:text-sm line-clamp-2 mt-1 hidden sm:block">
                  {episode.overview || 'No description available.'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cast */}
      {tv.credits?.cast && tv.credits.cast.length > 0 && (
        <section className="px-3 sm:px-8 lg:px-16 py-6 sm:py-8 bg-zinc-950">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Cast</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {tv.credits.cast.slice(0, 12).map((person) => (
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

      {/* Similar TV Shows */}
      {tv.similar?.results && tv.similar.results.length > 0 && (
        <section className="px-3 sm:px-8 lg:px-16 py-6 sm:py-8 bg-zinc-950">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Similar TV Shows</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
            {tv.similar.results.slice(0, 6).map((similarShow) => (
              <Link
                key={similarShow.id}
                href={`/tv/${similarShow.id}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 shadow-md group-hover:shadow-xl group-hover:shadow-red-900/20 transition-shadow ring-1 ring-zinc-700">
                  {similarShow.poster_path ? (
                    <Image
                      src={getImageUrl(similarShow.poster_path, 'poster', 'medium')!}
                      alt={similarShow.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-zinc-500 text-xs text-center px-2">
                        {similarShow.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs sm:text-sm font-medium truncate">
                      {similarShow.name}
                    </p>
                    <p className="text-zinc-400 text-xs hidden sm:block">
                      {similarShow.first_air_date?.split('-')[0]}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New Content Warning Modal */}
      {showNewContentWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 sm:p-8 mx-4 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-yellow-600/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <h3 className="text-white text-lg font-semibold">Recently Released</h3>
            </div>
            <p className="text-zinc-400 text-sm mb-6">
              This TV show was recently released. The video may not be available yet on the server, or the quality may be lower than expected. Do you want to continue?
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors touch-manipulation"
                onClick={() => setShowNewContentWarning(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors touch-manipulation"
                onClick={() => {
                  setShowNewContentWarning(false);
                  setIsPlayerVisible(true);
                }}
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
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
