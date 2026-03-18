import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitarflix.com';

// Force dynamic generation to avoid build-time API calls
export const dynamic = 'force-dynamic';

// Helper function to get current date in YYYY-MM-DD format
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Static pages
const staticPages = [
  {
    url: SITE_URL,
    lastModified: getToday(),
    changeFrequency: 'daily' as const,
    priority: 1,
  },
  {
    url: `${SITE_URL}/browse/movie`,
    lastModified: getToday(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/browse/tv`,
    lastModified: getToday(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  },
];

// Get popular movies for sitemap
async function getPopularMovies() {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`,
      { next: { revalidate: 86400 } } // Cache for 1 day
    );
    const data = await res.json();
    return data.results?.slice(0, 50) || []; // Top 50 popular movies
  } catch (error) {
    console.error('Error fetching popular movies for sitemap:', error);
    return [];
  }
}

// Get popular TV shows for sitemap
async function getPopularTVShows() {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`,
      { next: { revalidate: 86400 } } // Cache for 1 day
    );
    const data = await res.json();
    return data.results?.slice(0, 50) || []; // Top 50 popular TV shows
  } catch (error) {
    console.error('Error fetching popular TV shows for sitemap:', error);
    return [];
  }
}

// Get trending content for sitemap
async function getTrendingContent() {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      { next: { revalidate: 86400 } } // Cache for 1 day
    );
    const data = await res.json();
    return data.results?.slice(0, 50) || []; // Top 50 trending items
  } catch (error) {
    console.error('Error fetching trending content for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [popularMovies, popularTVShows, trendingContent] = await Promise.all([
    getPopularMovies(),
    getPopularTVShows(),
    getTrendingContent(),
  ]);

  // Combine and deduplicate content
  const moviesMap = new Map();
  const tvShowsMap = new Map();

  // Add popular movies
  popularMovies.forEach((movie: any) => {
    if (!moviesMap.has(movie.id)) {
      moviesMap.set(movie.id, {
        url: `${SITE_URL}/movie/${movie.id}`,
        lastModified: movie.release_date || getToday(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    }
  });

  // Add popular TV shows
  popularTVShows.forEach((tv: any) => {
    if (!tvShowsMap.has(tv.id)) {
      tvShowsMap.set(tv.id, {
        url: `${SITE_URL}/tv/${tv.id}`,
        lastModified: tv.first_air_date || getToday(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    }
  });

  // Add trending content (higher priority)
  trendingContent.forEach((item: any) => {
    const isMovie = item.media_type === 'movie';
    const url = `${SITE_URL}/${isMovie ? 'movie' : 'tv'}/${item.id}`;
    const map = isMovie ? moviesMap : tvShowsMap;
    
    if (!map.has(item.id)) {
      map.set(item.id, {
        url,
        lastModified: item.release_date || item.first_air_date || getToday(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      });
    } else {
      // Update priority for trending items
      const existing = map.get(item.id);
      existing.priority = 0.9;
    }
  });

  // Convert maps to arrays and combine with static pages
  const movieUrls = Array.from(moviesMap.values());
  const tvShowUrls = Array.from(tvShowsMap.values());

  return [...staticPages, ...movieUrls, ...tvShowUrls];
}