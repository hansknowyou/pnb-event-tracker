'use client';

import { EventWithStats } from '@/types';
import { useState } from 'react';
import MediaItem from './MediaItem';

interface EventCardProps {
  event: EventWithStats;
  baseUrl: string;
  onDelete: () => void;
  onAddMedia: (eventId: string, mediaName: string) => void;
  onDeleteMedia: (mediaId: string) => void;
  onAddRoute: (mediaId: string, routeName: string, redirectUrl: string) => void;
  onDeleteRoute: (routeId: string) => void;
  onAdjustRouteClick: (routeId: string, adjustment: number) => void;
  onGenerateQR: (url: string, routeName: string) => void;
}

export default function EventCard({
  event,
  baseUrl,
  onDelete,
  onAddMedia,
  onDeleteMedia,
  onAddRoute,
  onDeleteRoute,
  onAdjustRouteClick,
  onGenerateQR,
}: EventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [mediaName, setMediaName] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${event.name}" and all its media and routes?`
      )
    )
      return;
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaName.trim()) return;

    await onAddMedia(event._id, mediaName);
    setMediaName('');
    setIsAddingMedia(false);
  };

  return (
    <div className="border-2 border-gray-400 rounded-lg p-5 bg-gray-50 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-2xl font-bold text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{event.name}</h2>
            <p className="text-sm text-gray-600">
              Total Clicks: <span className="font-bold text-green-600">{event.totalClicks || 0}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingMedia(!isAddingMedia)}
            className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            {isAddingMedia ? 'Cancel' : '+ Add Media'}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Event'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {isAddingMedia && (
            <form onSubmit={handleAddMedia} className="mb-4 p-3 bg-white rounded border border-gray-300">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Media name (e.g., Facebook, Instagram)"
                  value={mediaName}
                  onChange={(e) => setMediaName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Create Media
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {event.media && event.media.length > 0 ? (
              event.media.map((media) => (
                <MediaItem
                  key={media._id}
                  media={media}
                  baseUrl={baseUrl}
                  onDelete={() => onDeleteMedia(media._id)}
                  onAddRoute={onAddRoute}
                  onDeleteRoute={onDeleteRoute}
                  onAdjustRouteClick={onAdjustRouteClick}
                  onGenerateQR={onGenerateQR}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No media yet. Add one above!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
