import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PromotionChannel from '@/lib/models/PromotionChannel';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch all non-deleted promotion channels
export async function GET() {
  try {
    await dbConnect();

    const items = await PromotionChannel.find({ isDeleted: false }).sort({ name: 1 });

    return NextResponse.json(items, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching promotion channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotion channels' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// POST - Create a new promotion channel (admin only)
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
        { error: 'Channel name is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const item = await PromotionChannel.create({
      name: body.name.trim(),
      description: body.description?.trim() || '',
      requirements: body.requirements?.trim() || '',
      isPaidAds: Boolean(body.isPaidAds),
      languages: Array.isArray(body.languages) ? body.languages : [],
      notes: body.notes?.trim() || '',
      link: body.link?.trim() || '',
      isDeleted: false,
    });

    return NextResponse.json(item, { status: 201, headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error creating promotion channel:', error);
    return NextResponse.json(
      { error: 'Failed to create promotion channel' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
