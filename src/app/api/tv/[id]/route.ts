import { NextResponse } from 'next/server';
import { getTVDetails } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tvId = parseInt(id);
    
    if (isNaN(tvId)) {
      return NextResponse.json({ error: 'Invalid TV ID' }, { status: 400 });
    }
    
    const data = await getTVDetails(tvId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching TV details:', error);
    return NextResponse.json({ error: 'Failed to fetch TV details' }, { status: 500 });
  }
}
