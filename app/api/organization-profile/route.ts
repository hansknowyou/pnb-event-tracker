import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OrganizationProfile from '@/lib/models/OrganizationProfile';
import { corsHeaders } from '@/lib/cors';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch organization profile (admin only)
export async function GET() {
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
    const profile = await OrganizationProfile.findOne({});
    if (!profile) {
      return NextResponse.json({ name: '', logo: '' }, { headers: corsHeaders() });
    }
    return NextResponse.json(profile, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error fetching organization profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization profile' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// PUT - Upsert organization profile (admin only)
export async function PUT(req: NextRequest) {
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
    const payload = {
      name: body.name?.trim() || '',
      logo: body.logo || '',
    };

    const profile = await OrganizationProfile.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true }
    );

    return NextResponse.json(profile, { headers: corsHeaders() });
  } catch (error: unknown) {
    console.error('Error updating organization profile:', error);
    return NextResponse.json(
      { error: 'Failed to update organization profile' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
