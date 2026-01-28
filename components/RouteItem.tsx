'use client';

import { Route } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface RouteItemProps {
  route: Route;
  baseUrl: string;
  onDelete: () => void;
  onUpdateRoute: (routeId: string, routeName: string) => void;
  onAdjustClick: (adjustment: number) => void;
  onGenerateQR: () => void;
}

export default function RouteItem({
  route,
  baseUrl,
  onDelete,
  onUpdateRoute,
  onAdjustClick,
  onGenerateQR,
}: RouteItemProps) {
  const t = useTranslations('eventTracking');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(route.routeName);

  const trackingUrl = `${baseUrl}/api/track/${route._id}`;

  const handleDelete = async () => {
    if (!confirm(t('confirmDeleteRoute'))) return;
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
  };

  const handleSaveName = async () => {
    if (!editedName.trim() || editedName === route.routeName) {
      setEditedName(route.routeName);
      setIsEditingName(false);
      return;
    }
    await onUpdateRoute(route._id, editedName);
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditedName(route.routeName);
      setIsEditingName(false);
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="space-y-2">
        {isEditingName ? (
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={handleNameKeyDown}
            className="font-semibold"
            autoFocus
          />
        ) : (
          <CardTitle
            className="cursor-pointer hover:text-blue-600"
            onClick={() => setIsEditingName(true)}
            title={t('clickToEdit')}
          >
            {route.routeName}
          </CardTitle>
        )}
        <CardDescription className="space-y-1">
          <div>
            <span className="font-semibold text-foreground">{t('trackingUrlLabel')}:</span>{' '}
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {trackingUrl}
            </a>
          </div>
          <div>
            <span className="font-semibold text-foreground">{t('redirectsToLabel')}:</span>{' '}
            <a
              href={route.redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {route.redirectUrl}
            </a>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">{t('clicksLabel')}:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onAdjustClick(-1)}
              title={t('decreaseClicks')}
            >
              -
            </Button>
            <span className="min-w-[3rem] text-center font-semibold text-lg">
              {route.clickCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onAdjustClick(1)}
              title={t('increaseClicks')}
            >
              +
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={onGenerateQR} size="sm">
            {t('qrCode')}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t('deleting') : t('delete')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
