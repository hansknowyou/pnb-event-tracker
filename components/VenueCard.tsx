'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import type { Venue } from '@/types/venue';

interface VenueCardProps {
  item: Venue;
  onEdit: () => void;
}

export default function VenueCard({ item, onEdit }: VenueCardProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const truncatedIntro = truncateText(item.intro || '', 150);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <Button variant="outline" size="sm" onClick={onEdit} className="no-print">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {item.image && (
          <div className="relative w-full h-48 rounded-md overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {item.city && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{item.city}</span>
            {item.location && <span className="text-gray-400">- {item.location}</span>}
          </div>
        )}

        {truncatedIntro && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {truncatedIntro}
          </p>
        )}

        {item.staff && item.staff.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{item.staff.length} staff member{item.staff.length > 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Updated: {new Date(item.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
