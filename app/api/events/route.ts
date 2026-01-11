import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import Media from '@/lib/models/Media';
import Route from '@/lib/models/Route';
import { handleOptions, jsonResponse } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ createdAt: -1 });
    return jsonResponse({ events });
  } catch (error) {
    console.error('Events GET error:', error);
    return jsonResponse({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return jsonResponse({ error: 'Event name is required' }, { status: 400 });
    }

    await connectDB();
    const event = await Event.create({ name });
    return jsonResponse({ event });
  } catch (error) {
    console.error('Events POST error:', error);
    return jsonResponse({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return jsonResponse({ error: 'Event ID is required' }, { status: 400 });
    }

    await connectDB();

    // Get all media for this event
    const mediaList = await Media.find({ eventId: id });
    const mediaIds = mediaList.map(m => m._id?.toString());

    // Delete all routes for these media
    if (mediaIds.length > 0) {
      await Route.deleteMany({ mediaId: { $in: mediaIds } });
    }

    // Delete all media for this event
    await Media.deleteMany({ eventId: id });

    // Delete the event
    await Event.findByIdAndDelete(id);

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Events DELETE error:', error);
    return jsonResponse({ error: 'Failed to delete event' }, { status: 500 });
  }
}
