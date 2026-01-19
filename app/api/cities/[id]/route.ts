import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import City from '@/lib/models/City';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch single city
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const item = await City.findById(id);

    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching city:', error);
    return NextResponse.json(
      { error: 'Failed to fetch city' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// PATCH - Update city (admin only)
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

    const item = await City.findById(id);
    if (!item || item.isDeleted) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    if (body.cityName !== undefined) {
      if (body.cityName.trim() === '') {
        return NextResponse.json(
          { error: 'City name cannot be empty' },
          { status: 400, headers: corsHeaders() }
        );
      }
      item.cityName = body.cityName.trim();
    }
    if (body.province !== undefined) {
      item.province = body.province.trim();
    }
    if (body.country !== undefined) {
      item.country = body.country.trim();
    }

    await item.save();

    return NextResponse.json(item, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating city:', error);
    return NextResponse.json(
      { error: 'Failed to update city' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE - Soft delete city (admin only)
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

    const item = await City.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    item.isDeleted = true;
    await item.save();

    return NextResponse.json(
      { message: 'City deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    console.error('Error deleting city:', error);
    return NextResponse.json(
      { error: 'Failed to delete city' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
