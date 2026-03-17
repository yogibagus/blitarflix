import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movieId = parseInt(id);
    
    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
    }
    
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      return NextResponse.json({ results: [] });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return NextResponse.json({ results: [] });
  }
}
