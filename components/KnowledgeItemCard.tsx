'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import Image from 'next/image';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface KnowledgeItemCardProps {
  item: KnowledgeBaseItem;
  onEdit: () => void;
}

export default function KnowledgeItemCard({
  item,
  onEdit,
}: KnowledgeItemCardProps) {
  // Strip HTML tags and truncate description
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const plainDescription = stripHtml(item.description);
  const truncatedDescription = truncateText(plainDescription, 200);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <Button variant="outline" size="sm" onClick={onEdit} className="no-print">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {item.imageUrl && (
          <div className="relative w-full h-48 rounded-md overflow-hidden bg-gray-100">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        {truncatedDescription && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {truncatedDescription}
          </p>
        )}
        <div className="text-xs text-gray-500">
          Updated: {new Date(item.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
