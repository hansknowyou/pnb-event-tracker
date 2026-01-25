'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import type { Materials } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface Step5Props {
  data: Materials;
  onChange: (data: Materials) => void;
  onBlur: () => void;
  productionId?: string;
  getLinkedItems?: (section: string) => KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignments?: Record<string, string>;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step5Materials({
  data,
  onChange,
  onBlur,
  productionId,
  getLinkedItems,
  onKnowledgeChange,
  assignments,
  onAssignmentChange,
}: Step5Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState<string | null>(null);
  const videosData = Array.isArray(data.videos)
    ? { link: '', notes: '' }
    : data.videos || { link: '', notes: '' };
  const performerVideosData = data.performerVideos || { link: '', notes: '' };
  const logosData = Array.isArray(data.logos)
    ? { link: '', notes: '' }
    : data.logos || { link: '', notes: '' };

  // Get linked items for each section
  const linkedStep5 = getLinkedItems?.('step5') || [];
  const linkedVideos = getLinkedItems?.('step5_videos') || [];
  const linkedPerformerVideos = getLinkedItems?.('step5_performerVideos') || [];
  const linkedPhotos = getLinkedItems?.('step5_photos') || [];
  const linkedActorPhotos = getLinkedItems?.('step5_actorPhotos') || [];
  const linkedOtherPhotos = getLinkedItems?.('step5_otherPhotos') || [];
  const linkedLogos = getLinkedItems?.('step5_logos') || [];
  const linkedTexts = getLinkedItems?.('step5_texts') || [];

  const renderSectionButtons = (section: string, linkedItems: KnowledgeBaseItem[], showSave = false) => (
    <div className="flex gap-2">
      {showSave && (
        <Button onClick={() => setTimeout(onBlur, 100)} size="sm">
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
      )}
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step5')}</h3>
          <p className="text-gray-600">Material Collection</p>
        </div>
        {renderSectionButtons('step5', linkedStep5, true)}
      </div>

      {/* 5.1 Videos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle>Past Performance Videos</CardTitle>
            {renderSectionButtons('step5_videos', linkedVideos)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Google Drive Folder Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={videosData.link}
              onChange={(e) => onChange({ ...data, videos: { ...videosData, link: e.target.value } })}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={videosData.notes}
              onChange={(e) => onChange({ ...data, videos: { ...videosData, notes: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 5.2 Performer Videos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle>Performer Videos</CardTitle>
            {renderSectionButtons('step5_performerVideos', linkedPerformerVideos)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Google Drive Folder Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={performerVideosData.link}
              onChange={(e) => onChange({ ...data, performerVideos: { ...performerVideosData, link: e.target.value } })}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={performerVideosData.notes}
              onChange={(e) => onChange({ ...data, performerVideos: { ...performerVideosData, notes: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 5.3 Performance Scene Photos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle>Performance Scene Photos</CardTitle>
            {renderSectionButtons('step5_photos', linkedPhotos)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Google Drive Folder Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.photos.link}
              onChange={(e) => onChange({ ...data, photos: { ...data.photos, link: e.target.value } })}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.photos.notes}
              onChange={(e) => onChange({ ...data, photos: { ...data.photos, notes: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 5.4 Performer Photos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle>Performer Photos</CardTitle>
            {renderSectionButtons('step5_actorPhotos', linkedActorPhotos)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Google Drive Folder Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.actorPhotos.link}
              onChange={(e) => onChange({ ...data, actorPhotos: { ...data.actorPhotos, link: e.target.value } })}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.actorPhotos.notes}
              onChange={(e) => onChange({ ...data, actorPhotos: { ...data.actorPhotos, notes: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 5.5 Other Photos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle>Other Photos</CardTitle>
            {renderSectionButtons('step5_otherPhotos', linkedOtherPhotos)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Google Drive Folder Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.otherPhotos.link}
              onChange={(e) => onChange({ ...data, otherPhotos: { ...data.otherPhotos, link: e.target.value } })}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.otherPhotos.notes}
              onChange={(e) => onChange({ ...data, otherPhotos: { ...data.otherPhotos, notes: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 5.6 Logos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle>Organization Logos</CardTitle>
            {renderSectionButtons('step5_logos', linkedLogos)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Google Drive Folder Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={logosData.link}
              onChange={(e) => onChange({ ...data, logos: { ...logosData, link: e.target.value } })}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={logosData.notes}
              onChange={(e) => onChange({ ...data, logos: { ...logosData, notes: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 5.7 Texts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle>Performance Copy/Text</CardTitle>
            {renderSectionButtons('step5_texts', linkedTexts)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Google Drive Folder Link (Original Copies)</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.texts.link}
              onChange={(e) => onChange({ ...data, texts: { ...data.texts, link: e.target.value } })}
            />
          </div>
          <div>
            <Label>Short Description</Label>
            <Textarea
              placeholder="Brief description..."
              rows={2}
              value={data.texts.shortDescription}
              onChange={(e) => onChange({ ...data, texts: { ...data.texts, shortDescription: e.target.value } })}
            />
          </div>
          <div>
            <Label>Long Description</Label>
            <Textarea
              placeholder="Detailed description..."
              rows={4}
              value={data.texts.longDescription}
              onChange={(e) => onChange({ ...data, texts: { ...data.texts, longDescription: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Knowledge View Dialogs */}
      <KnowledgeViewDialog
        knowledgeItems={linkedStep5}
        open={showKnowledge === 'step5'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linkedVideos}
        open={showKnowledge === 'step5_videos'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linkedPerformerVideos}
        open={showKnowledge === 'step5_performerVideos'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linkedPhotos}
        open={showKnowledge === 'step5_photos'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linkedActorPhotos}
        open={showKnowledge === 'step5_actorPhotos'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linkedOtherPhotos}
        open={showKnowledge === 'step5_otherPhotos'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linkedLogos}
        open={showKnowledge === 'step5_logos'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linkedTexts}
        open={showKnowledge === 'step5_texts'}
        onClose={() => setShowKnowledge(null)}
      />
    </div>
  );
}
