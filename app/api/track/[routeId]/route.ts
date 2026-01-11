import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Route from '@/lib/models/Route';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ routeId: string }> }
) {
  try {
    const { routeId } = await params;

    await connectDB();
    const route = await Route.findById(routeId);

    if (!route) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }

    // Increment click count
    route.clickCount += 1;
    await route.save();

    // Redirect to the actual ticket purchasing URL
    return NextResponse.redirect(route.redirectUrl);
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}
