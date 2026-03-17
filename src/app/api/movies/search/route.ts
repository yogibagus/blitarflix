import { NextResponse } from 'next/server';
import { searchMovies } from '@/lib/tmdb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1');
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }
    
    const data = await searchMovies(query, page);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching movies:', error);
    return NextResponse.json({ error: 'Failed to search movies' }, { status: 500 });
  }
}
