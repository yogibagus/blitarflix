import { NextResponse } from 'next/server';
import { getPopularMovies } from '@/lib/tmdb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    const data = await getPopularMovies(page);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return NextResponse.json({ error: 'Failed to fetch popular movies' }, { status: 500 });
  }
}
