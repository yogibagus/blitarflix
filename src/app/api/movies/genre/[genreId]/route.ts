import { NextResponse } from 'next/server';
import { getMoviesByGenre } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ genreId: string }> }
) {
  try {
    const { genreId } = await params;
    const genre = parseInt(genreId);
    
    if (isNaN(genre)) {
      return NextResponse.json({ error: 'Invalid genre ID' }, { status: 400 });
    }
    
    const data = await getMoviesByGenre(genre);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return NextResponse.json({ error: 'Failed to fetch movies by genre' }, { status: 500 });
  }
}
