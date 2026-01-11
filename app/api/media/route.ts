import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Media from '@/lib/models/Media';
import Route from '@/lib/models/Route';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    await connectDB();
    const media = await Media.find({ eventId }).sort({ createdAt: -1 });
    return NextResponse.json({ media });
  } catch (error) {
    console.error('Media GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, name } = body;

    if (!eventId || !name) {
      return NextResponse.json({ error: 'Event ID and name are required' }, { status: 400 });
    }

    await connectDB();
    const media = await Media.create({ eventId, name });
    return NextResponse.json({ media });
  } catch (error) {
    console.error('Media POST error:', error);
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    await connectDB();

    // Delete all routes for this media
    await Route.deleteMany({ mediaId: id });

    // Delete the media
    await Media.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Media DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
