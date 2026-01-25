import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MediaPackage from '@/lib/models/MediaPackage';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch single media package
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const item = await MediaPackage.findById(id);
    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Media package not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching media package:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media package' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// PATCH - Update media package (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const body = await req.json();

    const item = await MediaPackage.findById(id);
    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Media package not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json(
          { error: 'Package name cannot be empty' },
          { status: 400, headers: corsHeaders() }
        );
      }
      item.name = body.name.trim();
    }

    if (body.description !== undefined) {
      item.description = body.description?.trim() || '';
    }

    if (body.mediaTypes !== undefined) {
      item.mediaTypes = Array.isArray(body.mediaTypes) ? body.mediaTypes : [];
    }

    await item.save();

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating media package:', error);
    return NextResponse.json(
      { error: 'Failed to update media package' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Soft delete media package (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const item = await MediaPackage.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Media package not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    item.isDeleted = true;
    await item.save();

    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error deleting media package:', error);
    return NextResponse.json(
      { error: 'Failed to delete media package' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
