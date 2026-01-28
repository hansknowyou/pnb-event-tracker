'use client';

import { EventWithStats } from '@/types';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import MediaItem from './MediaItem';
import ProductionLinkButtons from './ProductionLinkButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import type { Production } from '@/types/production';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('eventTracking');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [mediaName, setMediaName] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.name);

  const handleDelete = async () => {
    if (
      !confirm(
        t('confirmDeleteEvent', { name: event.name })
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
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="mt-1"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? t('collapseEvent') : t('expandEvent')}
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </Button>
          <div className="space-y-2">
            {isEditingTitle ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleTitleKeyDown}
                className="text-lg font-semibold"
                autoFocus
              />
            ) : (
              <CardTitle
                className="cursor-pointer hover:text-blue-600"
                onClick={() => setIsEditingTitle(true)}
                title={t('clickToEdit')}
              >
                {event.name}
              </CardTitle>
            )}
            <CardDescription>
              {t('totalClicks')}: <span className="font-semibold text-foreground">{event.totalClicks || 0}</span>
            </CardDescription>
            <div>
              <ProductionLinkButtons
                event={event}
                linkedProduction={linkedProduction}
                onUpdate={onUpdate}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isAddingMedia ? 'outline' : 'default'}
            onClick={() => setIsAddingMedia(!isAddingMedia)}
          >
            {isAddingMedia ? t('cancel') : t('addMedia')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t('deleting') : t('deleteEvent')}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {isAddingMedia && (
            <form onSubmit={handleAddMedia} className="flex flex-col gap-2 md:flex-row">
              <Input
                type="text"
                placeholder={t('mediaNamePlaceholder')}
                value={mediaName}
                onChange={(e) => setMediaName(e.target.value)}
                required
              />
              <Button type="submit">{t('createMedia')}</Button>
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
              <p className="text-sm text-muted-foreground italic">
                {t('noMedia')}
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
