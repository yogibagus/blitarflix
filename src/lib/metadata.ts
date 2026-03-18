import { Metadata } from 'next';
import { getImageUrl } from './tmdb';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitarflix.com';
const SITE_NAME = 'BlitarFlix';

interface SEOConfig {
  title: string;
  description: string;
  path?: string;
  images?: string[];
  type?: 'website' | 'video.movie' | 'video.tv_show';
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    path = '',
    images = [],
    type = 'website',
    publishedTime,
    modifiedTime,
  } = config;

  const url = `${SITE_URL}${path}`;
  const ogImage = images.length > 0 ? images[0] : `${SITE_URL}/og-image.jpg`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@blitarflix',
    },
  };
}

export function generateMovieMetadata(movie: any, id: string): Metadata {
  const year = movie.release_date?.split('-')[0] || '';
  const genres = movie.genres?.map((g: any) => g.name).join(', ') || '';
  
  const title = `${movie.title} (${year}) | Watch Online Free - ${SITE_NAME}`;
  const description = `Watch ${movie.title} (${year}) online for free. ${movie.overview?.slice(0, 200)}... Starring: ${movie.credits?.cast?.slice(0, 3).map((c: any) => c.name).join(', ') || 'Unknown'}. ${genres} | Rating: ${movie.vote_average?.toFixed(1)}/10`;

  const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop', 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'poster', 'original');
  const images = [backdropUrl, posterUrl].filter(Boolean) as string[];

  return generateMetadata({
    title,
    description,
    path: `/movie/${id}`,
    images,
    type: 'video.movie',
    publishedTime: movie.release_date,
    modifiedTime: new Date().toISOString(),
  });
}

export function generateTVMetadata(tv: any, id: string): Metadata {
  const year = tv.first_air_date?.split('-')[0] || '';
  const genres = tv.genres?.map((g: any) => g.name).join(', ') || '';
  const seasons = tv.number_of_seasons || 1;
  
  const title = `${tv.name} (${year}) | Watch Online Free - ${SITE_NAME}`;
  const description = `Watch ${tv.name} (${year}) online for free. ${tv.overview?.slice(0, 200)}... ${seasons} ${seasons === 1 ? 'season' : 'seasons'}. ${genres} | Rating: ${tv.vote_average?.toFixed(1)}/10`;

  const backdropUrl = getImageUrl(tv.backdrop_path, 'backdrop', 'original');
  const posterUrl = getImageUrl(tv.poster_path, 'poster', 'original');
  const images = [backdropUrl, posterUrl].filter(Boolean) as string[];

  return generateMetadata({
    title,
    description,
    path: `/tv/${id}`,
    images,
    type: 'video.tv_show',
    publishedTime: tv.first_air_date,
    modifiedTime: new Date().toISOString(),
  });
}

export function generateBrowseMetadata(
  type: 'genre' | 'platform' | 'all',
  name: string,
  id?: string
): Metadata {
  let title = '';
  let description = '';
  let path = '';

  if (type === 'genre') {
    title = `${name} Movies & TV Shows | Watch Online Free - ${SITE_NAME}`;
    description = `Browse and watch ${name} movies and TV shows online for free. The best ${name} content available to stream now. High quality, no ads.`;
    path = `/browse/genre/${id}`;
  } else if (type === 'platform') {
    title = `${name} Movies & TV Shows | Watch Online Free - ${SITE_NAME}`;
    description = `Watch ${name} movies and TV shows online for free. Complete ${name} collection available to stream now. High quality, no ads.`;
    path = `/browse/platform/${id}`;
  } else {
    title = `Browse All Movies & TV Shows | Watch Online Free - ${SITE_NAME}`;
    description = `Explore our complete collection of movies and TV shows. Browse by genre, platform, or find trending content. Watch online for free.`;
    path = '/browse/all';
  }

  return generateMetadata({
    title,
    description,
    path,
  });
}