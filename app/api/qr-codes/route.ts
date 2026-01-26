import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QRCode from '@/lib/models/QRCode';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch all non-deleted QR codes
export async function GET() {
  try {
    await dbConnect();
    const items = await QRCode.find({ isDeleted: false }).sort({ createdAt: -1 });
    return NextResponse.json(items, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching QR codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR codes' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// POST - Create a new QR code (admin only)
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

    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const item = await QRCode.create({
      title: body.title.trim(),
      description: body.description?.trim() || '',
      image: body.image || '',
      isDeleted: false,
    });

    return NextResponse.json(item, { status: 201, headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error creating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to create QR code' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
