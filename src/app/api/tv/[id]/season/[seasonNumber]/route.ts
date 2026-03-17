import { NextResponse } from 'next/server';
import { getTVSeasonDetails } from '@/lib/tmdb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; seasonNumber: string }> }
) {
  try {
    const { id, seasonNumber } = await params;
    const tvId = parseInt(id);
    const season = parseInt(seasonNumber);
    
    if (isNaN(tvId) || isNaN(season)) {
      return NextResponse.json({ error: 'Invalid TV ID or season number' }, { status: 400 });
    }
    
    const data = await getTVSeasonDetails(tvId, season);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching season details:', error);
    return NextResponse.json({ error: 'Failed to fetch season details' }, { status: 500 });
  }
}
