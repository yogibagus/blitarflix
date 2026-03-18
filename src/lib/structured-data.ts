import { getImageUrl } from './tmdb';

export function generateMovieSchema(movie: any, id: string) {
  const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop', 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'poster', 'original');
  const year = movie.release_date?.split('-')[0] || '';
  const genres = movie.genres?.map((g: any) => g.name) || [];
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    alternateName: movie.title,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blitarflix.com'}/movie/${id}`,
    image: posterUrl || backdropUrl,
    thumbnailUrl: getImageUrl(movie.poster_path, 'poster', 'medium'),
    description: movie.overview,
    datePublished: movie.release_date,
    dateCreated: movie.release_date,
    inLanguage: 'en',
    genre: genres,
    contentRating: movie.adult ? 'Adults Only' : 'General',
    duration: `PT${movie.runtime || 90}M`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.vote_average,
      ratingCount: movie.vote_count,
      bestRating: '10',
      worstRating: '1',
    },
    director: movie.credits?.crew
      ?.filter((c: any) => c.job === 'Director')
      .map((d: any) => ({
        '@type': 'Person',
        name: d.name,
      })),
    actor: movie.credits?.cast?.slice(0, 10).map((a: any) => ({
      '@type': 'Person',
      name: a.name,
      role: {
        '@type': 'Role',
        characterName: a.character,
      },
    })),
    creator: movie.credits?.crew
      ?.filter((c: any) => ['Director', 'Screenplay', 'Writer'].includes(c.job))
      .map((c: any) => ({
        '@type': 'Person',
        name: c.name,
      })),
    productionCompany: movie.production_companies?.map((p: any) => ({
      '@type': 'Organization',
      name: p.name,
    })),
  };

  return JSON.stringify(schema);
}

export function generateTVSchema(tv: any, id: string) {
  const backdropUrl = getImageUrl(tv.backdrop_path, 'backdrop', 'original');
  const posterUrl = getImageUrl(tv.poster_path, 'poster', 'original');
  const year = tv.first_air_date?.split('-')[0] || '';
  const genres = tv.genres?.map((g: any) => g.name) || [];
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: tv.name,
    alternateName: tv.original_name,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blitarflix.com'}/tv/${id}`,
    image: posterUrl || backdropUrl,
    thumbnailUrl: getImageUrl(tv.poster_path, 'poster', 'medium'),
    description: tv.overview,
    datePublished: tv.first_air_date,
    startDate: tv.first_air_date,
    endDate: tv.status === 'Ended' ? tv.last_air_date : undefined,
    inLanguage: 'en',
    genre: genres,
    contentRating: tv.adult ? 'Adults Only' : 'General',
    numberOfEpisodes: tv.number_of_episodes,
    numberOfSeasons: tv.number_of_seasons,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tv.vote_average,
      ratingCount: tv.vote_count,
      bestRating: '10',
      worstRating: '1',
    },
    creator: tv.created_by?.map((c: any) => ({
      '@type': 'Person',
      name: c.name,
    })),
    actor: tv.credits?.cast?.slice(0, 10).map((a: any) => ({
      '@type': 'Person',
      name: a.name,
      role: {
        '@type': 'Role',
        characterName: a.character,
      },
    })),
    productionCompany: tv.production_companies?.map((p: any) => ({
      '@type': 'Organization',
      name: p.name,
    })),
    containsSeason: tv.seasons?.map((s: any) => ({
      '@type': 'Season',
      seasonNumber: s.season_number,
      numberOfEpisodes: s.episode_count,
      name: s.name,
      datePublished: s.air_date,
    })),
  };

  return JSON.stringify(schema);
}

export function generateWebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BlitarFlix',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blitarflix.com',
    description: 'Watch movies and TV shows online for free. Stream the latest movies, trending TV shows, and classic content in high quality.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://blitarflix.com'}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return JSON.stringify(schema);
}

export function generateBreadcrumbSchema(items: Array<{ name: string; item: string }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return JSON.stringify(schema);
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return JSON.stringify(schema);
}