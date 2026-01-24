import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AdminLogo from '@/lib/models/AdminLogo';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch all non-deleted logos
export async function GET() {
  try {
    await dbConnect();
    const items = await AdminLogo.find({ isDeleted: false }).sort({ updatedAt: -1 });
    return NextResponse.json(items, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching logos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logos' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// POST - Create a new logo (admin only)
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

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400, headers: corsHeaders() }
      );
    }
    if (!body.googleFolderLink?.trim()) {
      return NextResponse.json(
        { error: 'Google Drive folder link is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const item = await AdminLogo.create({
      title: body.title.trim(),
      googleFolderLink: body.googleFolderLink.trim(),
      colorLogoVertical: body.colorLogoVertical || '',
      whiteLogoVertical: body.whiteLogoVertical || '',
      colorLogoHorizontal: body.colorLogoHorizontal || '',
      whiteLogoHorizontal: body.whiteLogoHorizontal || '',
      isDeleted: false,
    });

    return NextResponse.json(item, { status: 201, headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error creating logo:', error);
    return NextResponse.json(
      { error: 'Failed to create logo' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
