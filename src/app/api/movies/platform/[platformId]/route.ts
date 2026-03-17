import { NextResponse } from 'next/server';
import { getMoviesByGenre, getPopularMovies } from '@/lib/tmdb';

// Platform to genre mapping
const platformGenreMap: Record<string, number> = {
  netflix: 35,      // Comedy
  prime: 28,        // Action
  disney: 16,       // Animation
  hbo: 18,          // Drama
  apple: 878,       // Sci-Fi
  paramount: 12,    // Adventure
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ platformId: string }> }
) {
  try {
    const { platformId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    let data;
    
    if (platformId === 'all') {
      data = await getPopularMovies(page);
    } else {
      const genreId = platformGenreMap[platformId];
      if (!genreId) {
        return NextResponse.json({ error: 'Invalid platform ID' }, { status: 400 });
      }
      data = await getMoviesByGenre(genreId, page);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching movies by platform:', error);
    return NextResponse.json({ error: 'Failed to fetch movies by platform' }, { status: 500 });
  }
}
