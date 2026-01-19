import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Community from '@/lib/models/Community';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET single community
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const community = await Community.findOne({ _id: id, isDeleted: false });

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(community, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT update community
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const community = await Community.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: body },
      { new: true }
    );

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(community, { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating community:', error);
    return NextResponse.json(
      { error: 'Failed to update community' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE community (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const community = await Community.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting community:', error);
    return NextResponse.json(
      { error: 'Failed to delete community' },
      { status: 500, headers: corsHeaders }
    );
  }
}
