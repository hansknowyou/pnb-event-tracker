import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AdminLogo from '@/lib/models/AdminLogo';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch single logo
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const item = await AdminLogo.findById(id);

    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Logo not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching logo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logo' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// PATCH - Update logo (admin only)
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

    const item = await AdminLogo.findById(id);
    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Logo not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    if (body.title !== undefined) {
      if (body.title.trim() === '') {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400, headers: corsHeaders() }
        );
      }
      item.title = body.title.trim();
    }

    if (body.googleFolderLink !== undefined) {
      if (body.googleFolderLink.trim() === '') {
        return NextResponse.json(
          { error: 'Google Drive folder link cannot be empty' },
          { status: 400, headers: corsHeaders() }
        );
      }
      item.googleFolderLink = body.googleFolderLink.trim();
    }

    if (body.colorLogoVertical !== undefined) {
      item.colorLogoVertical = body.colorLogoVertical || '';
    }

    if (body.whiteLogoVertical !== undefined) {
      item.whiteLogoVertical = body.whiteLogoVertical || '';
    }

    if (body.colorLogoHorizontal !== undefined) {
      item.colorLogoHorizontal = body.colorLogoHorizontal || '';
    }

    if (body.whiteLogoHorizontal !== undefined) {
      item.whiteLogoHorizontal = body.whiteLogoHorizontal || '';
    }

    await item.save();

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating logo:', error);
    return NextResponse.json(
      { error: 'Failed to update logo' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Soft delete logo (admin only)
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

    const item = await AdminLogo.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Logo not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    item.isDeleted = true;
    await item.save();

    return NextResponse.json(
      { message: 'Logo deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error deleting logo:', error);
    return NextResponse.json(
      { error: 'Failed to delete logo' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
