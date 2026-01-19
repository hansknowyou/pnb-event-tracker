'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Trash2, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Community } from '@/types/community';

interface CommunityCardProps {
  community: Community;
  onDelete?: () => void;
}

export default function CommunityCard({ community, onDelete }: CommunityCardProps) {
  const router = useRouter();
  const t = useTranslations('communities');

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader onClick={() => router.push(`/communities/${community._id}`)}>
        <CardTitle className="flex items-start justify-between">
          <span className="text-xl">{community.name}</span>
        </CardTitle>
        {community.city && (
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {community.city}
          </div>
        )}
      </CardHeader>
      <CardContent onClick={() => router.push(`/communities/${community._id}`)}>
        {community.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {community.description}
          </p>
        )}
        {community.staff && community.staff.length > 0 && (
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            {community.staff.length} {t('staffMembers')}
          </div>
        )}
        <div className="flex gap-2 mt-3">
          {community.files && (
            <a
              href={community.files}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-blue-600 hover:underline flex items-center"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {t('files')}
            </a>
          )}
          {community.images && (
            <a
              href={community.images}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-blue-600 hover:underline flex items-center"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {t('images')}
            </a>
          )}
        </div>
      </CardContent>
      {onDelete && (
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {t('delete')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
