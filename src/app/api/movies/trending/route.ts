import { NextResponse } from 'next/server';
import { getTrendingMovies } from '@/lib/tmdb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeWindow = (searchParams.get('timeWindow') as 'day' | 'week') || 'day';
    
    const data = await getTrendingMovies(timeWindow);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return NextResponse.json({ error: 'Failed to fetch trending movies' }, { status: 500 });
  }
}
