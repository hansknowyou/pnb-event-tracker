import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MediaPackage from '@/lib/models/MediaPackage';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch all non-deleted media packages
export async function GET() {
  try {
    await dbConnect();
    const items = await MediaPackage.find({ isDeleted: false }).sort({ updatedAt: -1 });
    return NextResponse.json(items, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching media packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media packages' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// POST - Create a new media package (admin only)
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

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Package name is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const item = await MediaPackage.create({
      name: body.name.trim(),
      description: body.description?.trim() || '',
      mediaTypes: Array.isArray(body.mediaTypes) ? body.mediaTypes : [],
      isDeleted: false,
    });

    return NextResponse.json(item, { status: 201, headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error creating media package:', error);
    return NextResponse.json(
      { error: 'Failed to create media package' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
