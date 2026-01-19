import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import City from '@/lib/models/City';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch all non-deleted cities
export async function GET() {
  try {
    await dbConnect();

    const items = await City.find({ isDeleted: false }).sort({ country: 1, province: 1, cityName: 1 });

    return NextResponse.json(items, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// POST - Create a new city (admin only)
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

    if (!body.cityName || body.cityName.trim() === '') {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const item = await City.create({
      cityName: body.cityName.trim(),
      province: body.province?.trim() || '',
      country: body.country?.trim() || '',
      isDeleted: false,
    });

    return NextResponse.json(item, { status: 201, headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error creating city:', error);
    return NextResponse.json(
      { error: 'Failed to create city' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
