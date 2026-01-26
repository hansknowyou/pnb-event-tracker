import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PromotionChannel from '@/lib/models/PromotionChannel';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// PATCH - Update promotion channel (admin only)
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

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Channel name is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const channel = await PromotionChannel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          name: body.name.trim(),
          description: body.description?.trim() || '',
          requirements: body.requirements?.trim() || '',
          isPaidAds: Boolean(body.isPaidAds),
          languages: Array.isArray(body.languages) ? body.languages : [],
          notes: body.notes?.trim() || '',
          link: body.link?.trim() || '',
        },
      },
      { new: true }
    );

    if (!channel) {
      return NextResponse.json(
        { error: 'Promotion channel not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(channel, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating promotion channel:', error);
    return NextResponse.json(
      { error: 'Failed to update promotion channel' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Soft delete promotion channel (admin only)
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

    const channel = await PromotionChannel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!channel) {
      return NextResponse.json(
        { error: 'Promotion channel not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { message: 'Promotion channel deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error deleting promotion channel:', error);
    return NextResponse.json(
      { error: 'Failed to delete promotion channel' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
