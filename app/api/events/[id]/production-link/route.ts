import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import Production from '@/lib/models/Production';
import { getCurrentUser } from '@/lib/auth';

// Link production to event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { productionId } = await request.json();

    if (!productionId) {
      return NextResponse.json({ error: 'Production ID is required' }, { status: 400 });
    }

    // Verify production exists
    const production = await Production.findById(productionId);
    if (!production) {
      return NextResponse.json({ error: 'Production not found' }, { status: 404 });
    }

    // Update event with production link
    const event = await Event.findByIdAndUpdate(
      resolvedParams.id,
      { linkedProductionId: productionId },
      { new: true }
    );

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const response = NextResponse.json(event);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error linking production to event:', error);
    return NextResponse.json(
      { error: 'Failed to link production' },
      { status: 500 }
    );
  }
}

// Unlink production from event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Update event to remove production link
    const event = await Event.findByIdAndUpdate(
      resolvedParams.id,
      { linkedProductionId: null },
      { new: true }
    );

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const response = NextResponse.json(event);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error unlinking production from event:', error);
    return NextResponse.json(
      { error: 'Failed to unlink production' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
