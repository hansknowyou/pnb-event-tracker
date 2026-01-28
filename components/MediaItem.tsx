'use client';

import { MediaWithStats } from '@/types';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import RouteItem from './RouteItem';
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
  const t = useTranslations('eventTracking');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(media.name);

  const handleDelete = async () => {
    if (!confirm(t('confirmDeleteMedia', { name: media.name }))) return;
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
    <Card className="bg-slate-50">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="mt-1"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? t('collapseMedia') : t('expandMedia')}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
          <div className="space-y-1">
            {isEditingName ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleNameKeyDown}
                className="text-base font-semibold"
                autoFocus
              />
            ) : (
              <CardTitle
                className="cursor-pointer hover:text-blue-600"
                onClick={() => setIsEditingName(true)}
                title={t('clickToEdit')}
              >
                {media.name}
              </CardTitle>
            )}
            <CardDescription>
              {t('totalClicks')}: <span className="font-semibold text-foreground">{media.totalClicks || 0}</span>
            </CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isAddingRoute ? 'outline' : 'default'}
            onClick={() => setIsAddingRoute(!isAddingRoute)}
          >
            {isAddingRoute ? t('cancel') : t('addRoute')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t('deleting') : t('deleteMedia')}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-3">
          {isAddingRoute && (
            <form onSubmit={handleAddRoute} className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Input
                type="text"
                placeholder={t('routeNamePlaceholder')}
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                required
              />
              <Input
                type="url"
                placeholder={t('redirectUrlPlaceholder')}
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                required
              />
              <Button type="submit">{t('createRoute')}</Button>
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
              <p className="text-sm text-muted-foreground italic">{t('noRoutes')}</p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
