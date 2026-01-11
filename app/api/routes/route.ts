import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Route from '@/lib/models/Route';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    await connectDB();
    const routes = await Route.find({ mediaId }).sort({ createdAt: -1 });
    return NextResponse.json({ routes });
  } catch (error) {
    console.error('Routes GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch routes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mediaId, routeName, redirectUrl } = body;

    if (!mediaId || !routeName || !redirectUrl) {
      return NextResponse.json(
        { error: 'Media ID, route name, and redirect URL are required' },
        { status: 400 }
      );
    }

    await connectDB();
    const route = await Route.create({ mediaId, routeName, redirectUrl, clickCount: 0 });
    return NextResponse.json({ route });
  } catch (error) {
    console.error('Routes POST error:', error);
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Route ID is required' }, { status: 400 });
    }

    await connectDB();
    await Route.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Routes DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, adjustment } = body;

    if (!id || typeof adjustment !== 'number') {
      return NextResponse.json(
        { error: 'Route ID and adjustment value are required' },
        { status: 400 }
      );
    }

    await connectDB();
    const route = await Route.findById(id);

    if (!route) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }

    route.clickCount = Math.max(0, route.clickCount + adjustment);
    await route.save();

    return NextResponse.json({ route });
  } catch (error) {
    console.error('Routes PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
  }
}
