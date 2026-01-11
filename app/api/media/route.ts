import connectDB from '@/lib/mongodb';
import Media from '@/lib/models/Media';
import Route from '@/lib/models/Route';
import { handleOptions, jsonResponse } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return jsonResponse({ error: 'Event ID is required' }, { status: 400 });
    }

    await connectDB();
    const media = await Media.find({ eventId }).sort({ createdAt: -1 });
    return jsonResponse({ media });
  } catch (error) {
    console.error('Media GET error:', error);
    return jsonResponse({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, name } = body;

    if (!eventId || !name) {
      return jsonResponse({ error: 'Event ID and name are required' }, { status: 400 });
    }

    await connectDB();
    const media = await Media.create({ eventId, name });
    return jsonResponse({ media });
  } catch (error) {
    console.error('Media POST error:', error);
    return jsonResponse({ error: 'Failed to create media' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return jsonResponse({ error: 'Media ID is required' }, { status: 400 });
    }

    await connectDB();

    // Delete all routes for this media
    await Route.deleteMany({ mediaId: id });

    // Delete the media
    await Media.findByIdAndDelete(id);

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Media DELETE error:', error);
    return jsonResponse({ error: 'Failed to delete media' }, { status: 500 });
  }
}
