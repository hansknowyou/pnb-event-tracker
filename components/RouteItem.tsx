'use client';

import { Route } from '@/types';
import { useState } from 'react';

interface RouteItemProps {
  route: Route;
  baseUrl: string;
  onDelete: () => void;
  onAdjustClick: (adjustment: number) => void;
  onGenerateQR: () => void;
}

export default function RouteItem({
  route,
  baseUrl,
  onDelete,
  onAdjustClick,
  onGenerateQR,
}: RouteItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const trackingUrl = `${baseUrl}/api/track/${route._id}`;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this route?')) return;
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="border border-gray-300 rounded p-3 bg-white">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{route.routeName}</h4>
          <div className="text-xs text-gray-500 mt-1 space-y-1">
            <div>
              <span className="font-semibold">Tracking URL:</span>{' '}
              <button
                onClick={() => copyToClipboard(trackingUrl)}
                className="text-blue-600 hover:underline break-all"
              >
                {trackingUrl}
              </button>
            </div>
            <div>
              <span className="font-semibold">Redirects to:</span>{' '}
              <a
                href={route.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {route.redirectUrl}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Clicks:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onAdjustClick(-1)}
              className="w-7 h-7 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 rounded font-bold text-sm"
              title="Decrease click count"
            >
              -
            </button>
            <span className="min-w-[3rem] text-center font-bold text-lg text-blue-600">
              {route.clickCount}
            </span>
            <button
              onClick={() => onAdjustClick(1)}
              className="w-7 h-7 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-700 rounded font-bold text-sm"
              title="Increase click count"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onGenerateQR}
            className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            QR Code
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
