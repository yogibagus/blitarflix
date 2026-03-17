const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const hasApiKey = TMDB_API_KEY && TMDB_API_KEY.length > 0;

export const TMDB_IMAGE_SIZES = {
  poster: {
    small: '/w185',
    medium: '/w342',
    large: '/w500',
    original: '/original',
  },
  backdrop: {
    small: '/w300',
    medium: '/w780',
    large: '/w1280',
    original: '/original',
  },
  profile: {
    small: '/w45',
    medium: '/w185',
    large: '/h632',
    original: '/original',
  },
};

export function getImageUrl(
  path: string | null,
  type: 'poster' | 'backdrop' | 'profile' = 'poster',
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string {
  if (!path) {
    return '/placeholder.svg';
  }
  return `${TMDB_IMAGE_BASE_URL}${TMDB_IMAGE_SIZES[type][size]}${path}`;
}

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  video: boolean;
}

export interface TMDBMovieDetails extends TMDBMovie {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  credits?: {
    cast: TMDBCast[];
    crew: TMDBCrew[];
  };
  videos?: {
    results: TMDBVideo[];
  };
  similar?: {
    results: TMDBMovie[];
  };
}

export interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  });

  const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<TMDBMovie>> {
  return fetchTMDB<TMDBResponse<TMDBMovie>>(`/trending/movie/${timeWindow}`);
}

export async function getTrendingTV(timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<TMDBMovie>> {
  return fetchTMDB<TMDBResponse<TMDBMovie>>(`/trending/tv/${timeWindow}`);
}

export async function getPopularMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return fetchTMDB<TMDBResponse<TMDBMovie>>('/movie/popular', { page: page.toString() });
}

export async function getTopRatedMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return fetchTMDB<TMDBResponse<TMDBMovie>>('/movie/top_rated', { page: page.toString() });
}

export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return fetchTMDB<TMDBResponse<TMDBMovie>>('/discover/movie', {
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: 'popularity.desc',
  });
}

export async function searchMovies(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
  return fetchTMDB<TMDBResponse<TMDBMovie>>('/search/movie', { query, page: page.toString() });
}

export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
  return fetchTMDB<TMDBMovieDetails>(`/movie/${movieId}`, {
    append_to_response: 'credits,videos,similar',
  });
}

// TV Show Types
export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
}

export interface TMDBTVDetails extends TMDBTVShow {
  status: string;
  tagline: string;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: TMDBSeason[];
  credits?: {
    cast: TMDBCast[];
    crew: TMDBCrew[];
  };
  videos?: {
    results: TMDBVideo[];
  };
  similar?: {
    results: TMDBTVShow[];
  };
}

export interface TMDBSeason {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episode_count: number;
}

export interface TMDBSeasonDetails {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episodes: TMDBEpisode[];
}

export interface TMDBEpisode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number;
  vote_average: number;
}

export async function getTVDetails(tvId: number): Promise<TMDBTVDetails> {
  return fetchTMDB<TMDBTVDetails>(`/tv/${tvId}`, {
    append_to_response: 'credits,videos,similar',
  });
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<TMDBSeasonDetails> {
  return fetchTMDB<TMDBSeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
}
