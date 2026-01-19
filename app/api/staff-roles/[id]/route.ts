import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import StaffRole from '@/lib/models/StaffRole';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch single staff role
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const item = await StaffRole.findById(id);

    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Staff role not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching staff role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff role' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// PATCH - Update staff role (admin only)
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

    const item = await StaffRole.findById(id);
    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'Staff role not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    if (body.name !== undefined) {
      if (body.name.trim() === '') {
        return NextResponse.json(
          { error: 'Role name cannot be empty' },
          { status: 400, headers: corsHeaders() }
        );
      }
      item.name = body.name.trim();
    }

    await item.save();

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating staff role:', error);
    return NextResponse.json(
      { error: 'Failed to update staff role' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Soft delete staff role (admin only)
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

    const item = await StaffRole.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Staff role not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    item.isDeleted = true;
    await item.save();

    return NextResponse.json(
      { message: 'Staff role deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error deleting staff role:', error);
    return NextResponse.json(
      { error: 'Failed to delete staff role' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
