'use client';

import { EventWithStats } from '@/types';
import { useState } from 'react';
import MediaItem from './MediaItem';
import ProductionLinkButtons from './ProductionLinkButtons';
import type { Production } from '@/types/production';

interface EventCardProps {
  event: EventWithStats;
  baseUrl: string;
  linkedProduction?: Production | null;
  onDelete: () => void;
  onAddMedia: (eventId: string, mediaName: string) => void;
  onDeleteMedia: (mediaId: string) => void;
  onUpdateMedia: (mediaId: string, name: string) => void;
  onAddRoute: (mediaId: string, routeName: string, redirectUrl: string) => void;
  onDeleteRoute: (routeId: string) => void;
  onUpdateRoute: (routeId: string, routeName: string) => void;
  onAdjustRouteClick: (routeId: string, adjustment: number) => void;
  onGenerateQR: (url: string, routeName: string) => void;
  onUpdateEvent: (eventId: string, name: string) => void;
  onUpdate: () => void;
}

export default function EventCard({
  event,
  baseUrl,
  linkedProduction,
  onDelete,
  onAddMedia,
  onDeleteMedia,
  onUpdateMedia,
  onAddRoute,
  onDeleteRoute,
  onUpdateRoute,
  onAdjustRouteClick,
  onGenerateQR,
  onUpdateEvent,
  onUpdate,
}: EventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [mediaName, setMediaName] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.name);

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

  const handleSaveTitle = async () => {
    if (!editedTitle.trim() || editedTitle === event.name) {
      setEditedTitle(event.name);
      setIsEditingTitle(false);
      return;
    }
    await onUpdateEvent(event._id, editedTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditedTitle(event.name);
      setIsEditingTitle(false);
    }
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
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleTitleKeyDown}
                className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 outline-none bg-transparent"
                autoFocus
              />
            ) : (
              <h2
                className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600"
                onClick={() => setIsEditingTitle(true)}
                title="Click to edit"
              >
                {event.name}
              </h2>
            )}
            <p className="text-sm text-gray-600">
              Total Clicks: <span className="font-bold text-green-600">{event.totalClicks || 0}</span>
            </p>
            <div className="mt-2">
              <ProductionLinkButtons
                event={event}
                linkedProduction={linkedProduction}
                onUpdate={onUpdate}
              />
            </div>
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
                  onUpdateMedia={onUpdateMedia}
                  onAddRoute={onAddRoute}
                  onDeleteRoute={onDeleteRoute}
                  onUpdateRoute={onUpdateRoute}
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
