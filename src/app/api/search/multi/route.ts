import { NextRequest, NextResponse } from 'next/server';
import { searchMulti } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const results = await searchMulti(query, page);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching content:', error);
    return NextResponse.json(
      { error: 'Failed to search content' },
      { status: 500 }
    );
  }
}