import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TicketingPlatform from '@/lib/models/TicketingPlatform';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch single ticketing platform
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const item = await TicketingPlatform.findById(id);

    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Ticketing platform not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching ticketing platform:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticketing platform' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// PATCH - Update ticketing platform (admin only)
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

    const item = await TicketingPlatform.findById(id);
    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Ticketing platform not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    if (body.name !== undefined) {
      if (body.name.trim() === '') {
        return NextResponse.json(
          { error: 'Platform name cannot be empty' },
          { status: 400, headers: corsHeaders() }
        );
      }
      item.name = body.name.trim();
    }

    if (body.logo !== undefined) {
      item.logo = body.logo || '';
    }

    if (body.link !== undefined) {
      item.link = body.link?.trim() || '';
    }

    if (body.description !== undefined) {
      item.description = body.description?.trim() || '';
    }

    await item.save();

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating ticketing platform:', error);
    return NextResponse.json(
      { error: 'Failed to update ticketing platform' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Soft delete ticketing platform (admin only)
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

    const item = await TicketingPlatform.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Ticketing platform not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    item.isDeleted = true;
    await item.save();

    return NextResponse.json(
      { message: 'Ticketing platform deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error deleting ticketing platform:', error);
    return NextResponse.json(
      { error: 'Failed to delete ticketing platform' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
