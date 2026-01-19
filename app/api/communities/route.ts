import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Community from '@/lib/models/Community';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET all communities
export async function GET() {
  try {
    await connectDB();
    const communities = await Community.find({ isDeleted: false }).sort({ name: 1 });
    return NextResponse.json(communities, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communities' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST create new community
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const community = await Community.create({
      ...body,
      createdBy: body.createdBy || 'system',
    });

    return NextResponse.json(community, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      { error: 'Failed to create community' },
      { status: 500, headers: corsHeaders }
    );
  }
}
