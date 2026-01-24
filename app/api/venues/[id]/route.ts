import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Venue from '@/lib/models/Venue';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch single venue
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const item = await Venue.findById(id);

    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching venue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venue' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// PATCH - Update venue (admin only)
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

    const item = await Venue.findById(id);
    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    if (body.name !== undefined) {
      if (body.name.trim() === '') {
        return NextResponse.json(
          { error: 'Name cannot be empty' },
          { status: 400, headers: corsHeaders() }
        );
      }
      item.name = body.name.trim();
    }
    if (body.location !== undefined) {
      item.location = body.location;
    }
    if (body.city !== undefined) {
      item.city = body.city;
    }
    if (body.intro !== undefined) {
      item.intro = body.intro;
    }
    if (body.staff !== undefined && Array.isArray(body.staff)) {
      item.staff = body.staff;
      item.markModified('staff');
    }
    if (body.logo !== undefined) {
      item.logo = body.logo;
    }
    if (body.image !== undefined) {
      item.image = body.image;
    }
    if (body.otherImages !== undefined && Array.isArray(body.otherImages)) {
      item.otherImages = body.otherImages;
      item.markModified('otherImages');
    }
    if (body.files !== undefined) {
      item.files = body.files;
    }
    if (body.mediaRequirements !== undefined) {
      item.mediaRequirements = body.mediaRequirements;
    }
    if (body.notes !== undefined) {
      item.notes = body.notes;
    }

    await item.save();

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating venue:', error);
    return NextResponse.json(
      { error: 'Failed to update venue' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Soft delete venue (admin only)
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

    const item = await Venue.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    item.isDeleted = true;
    await item.save();

    return NextResponse.json(
      { message: 'Venue deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error deleting venue:', error);
    return NextResponse.json(
      { error: 'Failed to delete venue' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
