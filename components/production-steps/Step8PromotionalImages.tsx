'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import type { PromotionalImages, ImageVersion, Poster4x3 } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface Step8Props {
  data: PromotionalImages;
  onChange: (data: PromotionalImages) => void;
  onBlur: () => void;
  productionId?: string;
  getLinkedItems?: (section: string) => KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignments?: Record<string, string>;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step8PromotionalImages({
  data,
  onChange,
  onBlur,
  productionId,
  getLinkedItems,
  onKnowledgeChange,
  assignments,
  onAssignmentChange,
}: Step8Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState<string | null>(null);

  // Get linked items for each section
  const linkedStep8 = getLinkedItems?.('step8') || [];
  const linked16x9 = getLinkedItems?.('step8_16x9') || [];
  const linked1x1Thumbnail = getLinkedItems?.('step8_1x1_thumbnail') || [];
  const linked1x1Poster = getLinkedItems?.('step8_1x1_poster') || [];
  const linked9x16 = getLinkedItems?.('step8_9x16') || [];
  const linked4x3 = getLinkedItems?.('step8_4x3') || [];
  const linked5x2 = getLinkedItems?.('step8_5x2') || [];
  const renderSectionButtons = (section: string, linkedItems: KnowledgeBaseItem[]) => (
    <div className="flex gap-2">
      {onKnowledgeChange && (
        <>
          <KnowledgeLinkButton
            section={section}
            linkedIds={linkedItems.map(k => k._id)}
            onChange={onKnowledgeChange}
          />
          {linkedItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowKnowledge(section)}
            >
              {t('view')} ({linkedItems.length})
            </Button>
          )}
        </>
      )}
      {productionId && onAssignmentChange && (
        <AssignButton
          section={section}
          assignedUserId={assignments?.[section]}
          productionId={productionId}
          onChange={onAssignmentChange}
        />
      )}
    </div>
  );

  // Helper functions for managing different image types
  const addImageVersion = (type: keyof Omit<PromotionalImages, 'poster4_3'>) => {
    const newImage: ImageVersion = {
      id: Date.now().toString(),
      versionType: 'main-visual',
      chineseLink: '',
      englishLink: '',
      notes: '',
    };
    onChange({ ...data, [type]: [...data[type], newImage] });
  };

  const removeImage = (type: keyof Omit<PromotionalImages, 'poster4_3'>, id: string) => {
    onChange({ ...data, [type]: data[type].filter((img: ImageVersion) => img.id !== id) });
  };

  const updateImage = (
    type: keyof Omit<PromotionalImages, 'poster4_3'>,
    id: string,
    field: keyof ImageVersion,
    value: string
  ) => {
    onChange({
      ...data,
      [type]: data[type].map((img: ImageVersion) =>
        img.id === id ? { ...img, [field]: value } : img
      ),
    });
  };

  // 4x3 poster management
  const add4x3Poster = () => {
    const newPoster: Poster4x3 = {
      id: Date.now().toString(),
      versionType: 'main-visual',
      usage: 'digital',
      chineseLink: '',
      englishLink: '',
      notes: '',
    };
    onChange({ ...data, poster4_3: [...data.poster4_3, newPoster] });
  };

  const remove4x3Poster = (id: string) => {
    onChange({ ...data, poster4_3: data.poster4_3.filter((p) => p.id !== id) });
  };

  const update4x3Poster = (id: string, field: keyof Poster4x3, value: string) => {
    onChange({
      ...data,
      poster4_3: data.poster4_3.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const renderImageSection = (
    title: string,
    description: string,
    type: keyof Omit<PromotionalImages, 'poster4_3'>,
    images: ImageVersion[],
    section: string,
    linkedItems: KnowledgeBaseItem[]
  ) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          {renderSectionButtons(section, linkedItems)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {images.map((img, index) => (
          <div key={img.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-semibold">Version {index + 1}</Label>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeImage(type, img.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <Label>Version Type</Label>
              <Select
                value={img.versionType}
                onValueChange={(value) => updateImage(type, img.id, 'versionType', value)}
              >
                <SelectTrigger onBlur={onBlur}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main-visual">Main Visual (主视觉)</SelectItem>
                  <SelectItem value="performance-scene">Performance Scene (演出现场)</SelectItem>
                  <SelectItem value="main-actor">Main Actor (主要演员)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Chinese Version Link</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={img.chineseLink}
                onChange={(e) => updateImage(type, img.id, 'chineseLink', e.target.value)}
                onBlur={onBlur}
              />
            </div>

            <div>
              <Label>English Version Link</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={img.englishLink}
                onChange={(e) => updateImage(type, img.id, 'englishLink', e.target.value)}
                onBlur={onBlur}
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Notes..."
                rows={2}
                value={img.notes}
                onChange={(e) => updateImage(type, img.id, 'notes', e.target.value)}
                onBlur={onBlur}
              />
            </div>
          </div>
        ))}

        <Button onClick={() => addImageVersion(type)} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Version
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step8')}</h3>
          <p className="text-gray-600">Promotional Images</p>
        </div>
        {renderSectionButtons('step8', linkedStep8)}
      </div>

      {renderImageSection(
        '8.1 16:9 Poster',
        'Name and date only',
        'poster16_9',
        data.poster16_9,
        'step8_16x9',
        linked16x9
      )}

      {renderImageSection(
        '8.2 1:1 Thumbnail',
        'No text - for ticket cover',
        'thumbnail1_1',
        data.thumbnail1_1,
        'step8_1x1_thumbnail',
        linked1x1Thumbnail
      )}

      {renderImageSection(
        '8.3 1:1 Poster',
        'With name, date, and logos',
        'poster1_1',
        data.poster1_1,
        'step8_1x1_poster',
        linked1x1Poster
      )}

      {renderImageSection(
        '8.4 9:16 Poster',
        'With name, date, and logos',
        'poster9_16',
        data.poster9_16,
        'step8_9x16',
        linked9x16
      )}

      {/* 8.5 4:3 Poster (special with usage field) */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle>8.5 4:3 Poster</CardTitle>
              <p className="text-sm text-gray-600">
                With name, date, logos, ticketing info, QR code - for print & digital
              </p>
            </div>
            {renderSectionButtons('step8_4x3', linked4x3)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.poster4_3.map((poster, index) => (
            <div key={poster.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">Version {index + 1}</Label>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove4x3Poster(poster.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Version Type</Label>
                  <Select
                    value={poster.versionType}
                    onValueChange={(value) => update4x3Poster(poster.id, 'versionType', value)}
                  >
                    <SelectTrigger onBlur={onBlur}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main-visual">Main Visual</SelectItem>
                      <SelectItem value="performance-scene">Performance Scene</SelectItem>
                      <SelectItem value="main-actor">Main Actor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Usage</Label>
                  <Select
                    value={poster.usage}
                    onValueChange={(value) => update4x3Poster(poster.id, 'usage', value)}
                  >
                    <SelectTrigger onBlur={onBlur}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="print">Print</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Chinese Version Link</Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={poster.chineseLink}
                  onChange={(e) => update4x3Poster(poster.id, 'chineseLink', e.target.value)}
                  onBlur={onBlur}
                />
              </div>

              <div>
                <Label>English Version Link</Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={poster.englishLink}
                  onChange={(e) => update4x3Poster(poster.id, 'englishLink', e.target.value)}
                  onBlur={onBlur}
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Notes..."
                  rows={2}
                  value={poster.notes}
                  onChange={(e) => update4x3Poster(poster.id, 'notes', e.target.value)}
                  onBlur={onBlur}
                />
              </div>
            </div>
          ))}

          <Button onClick={add4x3Poster} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Version
          </Button>
        </CardContent>
      </Card>

      {renderImageSection(
        '8.6 5:2 Pure Image',
        'No text - for Facebook cover',
        'cover5_2',
        data.cover5_2,
        'step8_5x2',
        linked5x2
      )}

      {/* Knowledge View Dialogs */}
      <KnowledgeViewDialog
        knowledgeItems={linkedStep8}
        open={showKnowledge === 'step8'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linked16x9}
        open={showKnowledge === 'step8_16x9'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linked1x1Thumbnail}
        open={showKnowledge === 'step8_1x1_thumbnail'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linked1x1Poster}
        open={showKnowledge === 'step8_1x1_poster'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linked9x16}
        open={showKnowledge === 'step8_9x16'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linked4x3}
        open={showKnowledge === 'step8_4x3'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linked5x2}
        open={showKnowledge === 'step8_5x2'}
        onClose={() => setShowKnowledge(null)}
      />
    </div>
  );
}
