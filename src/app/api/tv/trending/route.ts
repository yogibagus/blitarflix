import { NextResponse } from 'next/server';
import { getTrendingTV, getTVByGenre } from '@/lib/tmdb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const genre = searchParams.get('genre');
    
    let data;
    
    if (genre && genre !== 'all') {
      // Filter by genre using discover/tv endpoint
      const genreId = parseInt(genre);
      data = await getTVByGenre(genreId, page);
    } else {
      // Get all trending TV shows
      data = await getTrendingTV('week', page);
    }
    
    return NextResponse.json({
      ...data,
      page,
      results: data.results,
      total_pages: Math.min(data.total_pages || 1, 50),
    });
  } catch (error) {
    console.error('Error fetching trending TV:', error);
    return NextResponse.json({ error: 'Failed to fetch trending TV' }, { status: 500 });
  }
}
