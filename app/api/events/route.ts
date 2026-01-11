import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import Media from '@/lib/models/Media';
import Route from '@/lib/models/Route';

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Events GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    await connectDB();
    const event = await Event.create({ name });
    return NextResponse.json({ event });
  } catch (error) {
    console.error('Events POST error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Events DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
