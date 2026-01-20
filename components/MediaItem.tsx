'use client';

import { MediaWithStats } from '@/types';
import { useState } from 'react';
import RouteItem from './RouteItem';

interface MediaItemProps {
  media: MediaWithStats;
  baseUrl: string;
  onDelete: () => void;
  onUpdateMedia: (mediaId: string, name: string) => void;
  onAddRoute: (mediaId: string, routeName: string, redirectUrl: string) => void;
  onDeleteRoute: (routeId: string) => void;
  onUpdateRoute: (routeId: string, routeName: string) => void;
  onAdjustRouteClick: (routeId: string, adjustment: number) => void;
  onGenerateQR: (url: string, routeName: string) => void;
}

export default function MediaItem({
  media,
  baseUrl,
  onDelete,
  onUpdateMedia,
  onAddRoute,
  onDeleteRoute,
  onUpdateRoute,
  onAdjustRouteClick,
  onGenerateQR,
}: MediaItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(media.name);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${media.name}" and all its routes?`)) return;
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName.trim() || !redirectUrl.trim()) return;

    await onAddRoute(media._id, routeName, redirectUrl);
    setRouteName('');
    setRedirectUrl('');
    setIsAddingRoute(false);
  };

  const handleSaveName = async () => {
    if (!editedName.trim() || editedName === media.name) {
      setEditedName(media.name);
      setIsEditingName(false);
      return;
    }
    await onUpdateMedia(media._id, editedName);
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditedName(media.name);
      setIsEditingName(false);
    }
  };

  return (
    <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-lg font-bold text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <div>
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleNameKeyDown}
                className="text-lg font-semibold text-gray-900 border-b-2 border-blue-500 outline-none bg-transparent"
                autoFocus
              />
            ) : (
              <h3
                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                onClick={() => setIsEditingName(true)}
                title="Click to edit"
              >
                {media.name}
              </h3>
            )}
            <p className="text-sm text-gray-600">
              Total Clicks: <span className="font-bold text-blue-600">{media.totalClicks || 0}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingRoute(!isAddingRoute)}
            className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded"
          >
            {isAddingRoute ? 'Cancel' : '+ Add Route'}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Media'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {isAddingRoute && (
            <form onSubmit={handleAddRoute} className="mb-3 p-3 bg-white rounded border border-gray-300">
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  placeholder="Route name (e.g., facebook ad 1)"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="url"
                  placeholder="Redirect URL (3rd party ticket link)"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Create Route
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {media.routes && media.routes.length > 0 ? (
              media.routes.map((route) => (
                <RouteItem
                  key={route._id}
                  route={route}
                  baseUrl={baseUrl}
                  onDelete={() => onDeleteRoute(route._id)}
                  onUpdateRoute={onUpdateRoute}
                  onAdjustClick={(adjustment) => onAdjustRouteClick(route._id, adjustment)}
                  onGenerateQR={() =>
                    onGenerateQR(`${baseUrl}/api/track/${route._id}`, route.routeName)
                  }
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No routes yet. Add one above!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
