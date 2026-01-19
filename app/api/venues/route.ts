import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Venue from '@/lib/models/Venue';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch all non-deleted venues (with optional city filtering)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const cityParam = searchParams.get('city');

    const query: Record<string, unknown> = { isDeleted: false };

    if (cityParam) {
      query.city = cityParam;
    }

    const items = await Venue.find(query).sort({ updatedAt: -1 });

    return NextResponse.json(items, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching venues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// POST - Create a new venue (admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders() }
      );
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin permission required' },
        { status: 403, headers: corsHeaders() }
      );
    }

    await dbConnect();
    const body = await req.json();

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const item = await Venue.create({
      name: body.name.trim(),
      location: body.location || '',
      city: body.city || '',
      intro: body.intro || '',
      staff: Array.isArray(body.staff) ? body.staff : [],
      image: body.image || '',
      otherImages: Array.isArray(body.otherImages) ? body.otherImages : [],
      files: body.files || '',
      mediaRequirements: body.mediaRequirements || '',
      notes: body.notes || '',
      createdBy: user.userId,
      isDeleted: false,
    });

    return NextResponse.json(item, { status: 201, headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error creating venue:', error);
    return NextResponse.json(
      { error: 'Failed to create venue' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
