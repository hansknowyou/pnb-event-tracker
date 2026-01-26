import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QRCode from '@/lib/models/QRCode';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// PATCH - Update QR code (admin only)
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

    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const item = await QRCode.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          title: body.title.trim(),
          description: body.description?.trim() || '',
          image: body.image || '',
        },
      },
      { new: true }
    );

    if (!item) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to update QR code' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Soft delete QR code (admin only)
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

    const item = await QRCode.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!item) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { message: 'QR code deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error deleting QR code:', error);
    return NextResponse.json(
      { error: 'Failed to delete QR code' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
