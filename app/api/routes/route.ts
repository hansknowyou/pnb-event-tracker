import connectDB from '@/lib/mongodb';
import Route from '@/lib/models/Route';
import { handleOptions, jsonResponse } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return jsonResponse({ error: 'Media ID is required' }, { status: 400 });
    }

    await connectDB();
    const routes = await Route.find({ mediaId }).sort({ createdAt: -1 });
    return jsonResponse({ routes });
  } catch (error) {
    console.error('Routes GET error:', error);
    return jsonResponse({ error: 'Failed to fetch routes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mediaId, routeName, redirectUrl } = body;

    if (!mediaId || !routeName || !redirectUrl) {
      return jsonResponse(
        { error: 'Media ID, route name, and redirect URL are required' },
        { status: 400 }
      );
    }

    await connectDB();
    const route = await Route.create({ mediaId, routeName, redirectUrl, clickCount: 0 });
    return jsonResponse({ route });
  } catch (error) {
    console.error('Routes POST error:', error);
    return jsonResponse({ error: 'Failed to create route' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return jsonResponse({ error: 'Route ID is required' }, { status: 400 });
    }

    await connectDB();
    await Route.findByIdAndDelete(id);
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Routes DELETE error:', error);
    return jsonResponse({ error: 'Failed to delete route' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, adjustment, routeName } = body;

    if (!id) {
      return jsonResponse(
        { error: 'Route ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const route = await Route.findById(id);

    if (!route) {
      return jsonResponse({ error: 'Route not found' }, { status: 404 });
    }

    // Update click count if adjustment is provided
    if (typeof adjustment === 'number') {
      route.clickCount = Math.max(0, route.clickCount + adjustment);
    }

    // Update route name if provided
    if (routeName !== undefined) {
      route.routeName = routeName;
    }

    await route.save();

    return jsonResponse({ route });
  } catch (error) {
    console.error('Routes PATCH error:', error);
    return jsonResponse({ error: 'Failed to update route' }, { status: 500 });
  }
}
