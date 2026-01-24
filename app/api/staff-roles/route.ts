import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import StaffRole from '@/lib/models/StaffRole';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch all non-deleted staff roles
export async function GET() {
  try {
    await dbConnect();

    const items = await StaffRole.find({ isDeleted: false }).sort({ name: 1 });

    return NextResponse.json(items, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching staff roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff roles' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// POST - Create a new staff role (admin only)
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
        { error: 'Role name is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const item = await StaffRole.create({
      name: body.name.trim(),
      note: body.note?.trim() || undefined,
      isDeleted: false,
    });

    return NextResponse.json(item, { status: 201, headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error creating staff role:', error);
    return NextResponse.json(
      { error: 'Failed to create staff role' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
