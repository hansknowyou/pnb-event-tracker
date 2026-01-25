'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import PreviewLink from '@/components/PreviewLink';
import type { Videos, MediaDesignItem } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';
import type { MediaPackage } from '@/types/mediaPackage';

interface Step9Props {
  data: Videos;
  onChange: (data: Videos) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignedUserId?: string;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step9Videos({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange,
  assignedUserId,
  onAssignmentChange,
}: Step9Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [mediaPackages, setMediaPackages] = useState<MediaPackage[]>([]);
  const mediaItems = data.media || [];

  useEffect(() => {
    const fetchMediaPackages = async () => {
      try {
        const response = await fetch('/api/media-packages');
        if (response.ok) {
          const items = await response.json();
          setMediaPackages(items || []);
        }
      } catch (error) {
        console.error('Error fetching media packages:', error);
      }
    };
    fetchMediaPackages();
  }, []);

  const addMediaItem = () => {
    const nextItem: MediaDesignItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      mediaPackageIds: [],
      mediaLink: '',
    };
    onChange({ ...data, media: [...mediaItems, nextItem] });
  };

  const updateMediaItem = (id: string, updates: Partial<MediaDesignItem>) => {
    onChange({
      ...data,
      media: mediaItems.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  const removeMediaItem = (id: string) => {
    onChange({ ...data, media: mediaItems.filter((item) => item.id !== id) });
  };

  const togglePackage = (item: MediaDesignItem, packageId: string) => {
    const hasPackage = item.mediaPackageIds.includes(packageId);
    return hasPackage
      ? item.mediaPackageIds.filter((id) => id !== packageId)
      : [...item.mediaPackageIds, packageId];
  };

  const renderPackageSummary = (pkg: MediaPackage) => {
    const mediaTypeTitles = pkg.mediaTypes
      .map((mediaType) => mediaType.title || 'Untitled')
      .slice(0, 3);
    const moreCount = pkg.mediaTypes.length - mediaTypeTitles.length;
    const summary = mediaTypeTitles.join(', ');
    return (
      <div className="text-xs text-gray-500">
        {pkg.mediaTypes.length === 0 ? 'No media types' : `${summary}${moreCount > 0 ? ` +${moreCount}` : ''}`}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step9')}</h3>
          <p className="text-gray-600">Video Production</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTimeout(onBlur, 100)} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          {onKnowledgeChange && (
            <>
              <KnowledgeLinkButton
                section="step9"
                linkedIds={linkedKnowledge.map(k => k._id)}
                onChange={onKnowledgeChange}
              />
              {linkedKnowledge.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKnowledge(true)}
                >
                  {t('view')} ({linkedKnowledge.length})
                </Button>
              )}
            </>
          )}
          {productionId && onAssignmentChange && (
            <AssignButton
              section="step9"
              assignedUserId={assignedUserId}
              productionId={productionId}
              onChange={onAssignmentChange}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {mediaItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No media added yet. Click "Add Media" below.
          </div>
        )}

        {mediaItems.map((item, index) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle>Media {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeMediaItem(item.id)}
              >
                <span className="text-red-500">×</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) => updateMediaItem(item.id, { title: e.target.value })}
                  placeholder="e.g., Trailer Cut"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => updateMediaItem(item.id, { description: e.target.value })}
                  placeholder="Short description..."
                />
              </div>

              <div>
                <Label>Media Packages</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {mediaPackages.map((pkg) => (
                    <label
                      key={pkg._id}
                      className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:border-gray-400"
                    >
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={item.mediaPackageIds.includes(pkg._id || '')}
                        onChange={() => updateMediaItem(item.id, {
                          mediaPackageIds: togglePackage(item, pkg._id || ''),
                        })}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{pkg.name}</div>
                        {pkg.description && (
                          <div className="text-xs text-gray-500 line-clamp-2">{pkg.description}</div>
                        )}
                        {renderPackageSummary(pkg)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {item.mediaPackageIds.length > 0 && (
                <div className="rounded-md border bg-gray-50 p-3 space-y-2">
                  {item.mediaPackageIds.map((pkgId) => {
                    const pkg = mediaPackages.find((entry) => entry._id === pkgId);
                    if (!pkg) return null;
                    return (
                      <div key={pkgId} className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{pkg.name}</div>
                          {pkg.description && (
                            <p className="text-xs text-gray-500">{pkg.description}</p>
                          )}
                          {renderPackageSummary(pkg)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <Label className="mb-0">Media files link</Label>
                  <PreviewLink href={item.mediaLink} />
                </div>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={item.mediaLink}
                  onChange={(e) => updateMediaItem(item.id, { mediaLink: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addMediaItem}>
          Add Media
        </Button>
      </div>

      <KnowledgeViewDialog
        knowledgeItems={linkedKnowledge}
        open={showKnowledge}
        onClose={() => setShowKnowledge(false)}
      />
    </div>
  );
}
