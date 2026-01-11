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
    const media = await Media.find({});
    const routes = await Route.find({});

    // Calculate stats for each event
    const eventStats = await Promise.all(
      events.map(async (event) => {
        const eventId = event._id?.toString();
        const eventMedia = media.filter((m) => m.eventId === eventId);
        const mediaIds = eventMedia.map((m) => m._id?.toString());
        const eventRoutes = routes.filter((r) => mediaIds.includes(r.mediaId));
        const totalClicks = eventRoutes.reduce((sum, r) => sum + r.clickCount, 0);

        // Get media stats
        const mediaStats = eventMedia.map((m) => {
          const mediaId = m._id?.toString();
          const mediaRoutes = routes.filter((r) => r.mediaId === mediaId);
          const mediaClicks = mediaRoutes.reduce((sum, r) => sum + r.clickCount, 0);

          return {
            ...m.toObject(),
            totalClicks: mediaClicks,
            routes: mediaRoutes,
          };
        });

        return {
          ...event.toObject(),
          totalClicks,
          media: mediaStats,
        };
      })
    );

    return jsonResponse({ events: eventStats });
  } catch (error) {
    console.error('Stats GET error:', error);
    return jsonResponse({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
