'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import type { PressConference } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface Step10Props {
  data: PressConference;
  onChange: (data: PressConference) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignedUserId?: string;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step10PressConference({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange,
  assignedUserId,
  onAssignmentChange,
}: Step10Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step10')}</h3>
          <p className="text-gray-600">Press Conference</p>
        </div>
        <div className="flex gap-2">
          {onKnowledgeChange && (
            <>
              <KnowledgeLinkButton
                section="step10"
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
              section="step10"
              assignedUserId={assignedUserId}
              productionId={productionId}
              onChange={onAssignmentChange}
            />
          )}
        </div>
      </div>

      {/* 10.1 Venue Info */}
      <Card>
        <CardHeader>
          <CardTitle>10.1 Press Conference Venue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Date & Time</Label>
            <Input
              placeholder="e.g., 2024-12-15 14:00"
              value={data.venue.datetime}
              onChange={(e) => onChange({
                ...data,
                venue: { ...data.venue, datetime: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              placeholder="Venue location"
              value={data.venue.location}
              onChange={(e) => onChange({
                ...data,
                venue: { ...data.venue, location: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.venue.notes}
              onChange={(e) => onChange({
                ...data,
                venue: { ...data.venue, notes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      {/* 10.2-10.7 Simple Links */}
      {[
        { key: 'invitation', title: '10.2 Invitation' },
        { key: 'guestList', title: '10.3 Guest List' },
        { key: 'pressRelease', title: '10.4 Press Release' },
        { key: 'backdropVideo', title: '10.5 Backdrop Video' },
        { key: 'backgroundMusic', title: '10.6 Background Music' },
        { key: 'screenContent', title: '10.7 Background Screen Content' },
      ].map(({ key, title }) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Link</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={(data as any)[key].link}
                onChange={(e) => onChange({
                  ...data,
                  [key]: { ...(data as any)[key], link: e.target.value }
                })}
                onBlur={onBlur}
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Notes..."
                rows={2}
                value={(data as any)[key].notes}
                onChange={(e) => onChange({
                  ...data,
                  [key]: { ...(data as any)[key], notes: e.target.value }
                })}
                onBlur={onBlur}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 10.8 Rollup Banner PDF */}
      <Card>
        <CardHeader>
          <CardTitle>10.8 Rollup Banner Design PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>PDF Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.rollupBannerPDF.link}
              onChange={(e) => onChange({
                ...data,
                rollupBannerPDF: { ...data.rollupBannerPDF, link: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="banner-printed"
              checked={data.rollupBannerPDF.isPrinted}
              onCheckedChange={(checked) => onChange({
                ...data,
                rollupBannerPDF: { ...data.rollupBannerPDF, isPrinted: checked as boolean }
              })}
            />
            <Label htmlFor="banner-printed" className="cursor-pointer">
              Printed
            </Label>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.rollupBannerPDF.notes}
              onChange={(e) => onChange({
                ...data,
                rollupBannerPDF: { ...data.rollupBannerPDF, notes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      {/* 10.9 Small Poster */}
      <Card>
        <CardHeader>
          <CardTitle>10.9 Small Poster</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.smallPoster.link}
              onChange={(e) => onChange({
                ...data,
                smallPoster: { ...data.smallPoster, link: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="poster-printed"
              checked={data.smallPoster.isPrinted}
              onCheckedChange={(checked) => onChange({
                ...data,
                smallPoster: { ...data.smallPoster, isPrinted: checked as boolean }
              })}
            />
            <Label htmlFor="poster-printed" className="cursor-pointer">
              Printed
            </Label>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.smallPoster.notes}
              onChange={(e) => onChange({
                ...data,
                smallPoster: { ...data.smallPoster, notes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      {/* 10.10 On-site Footage */}
      <Card>
        <CardHeader>
          <CardTitle>10.10 On-site Shooting Footage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Close-ups Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.onSiteFootage.closeUps}
              onChange={(e) => onChange({
                ...data,
                onSiteFootage: { ...data.onSiteFootage, closeUps: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Backdrop/Screen/Scenery Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.onSiteFootage.scenery}
              onChange={(e) => onChange({
                ...data,
                onSiteFootage: { ...data.onSiteFootage, scenery: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.onSiteFootage.notes}
              onChange={(e) => onChange({
                ...data,
                onSiteFootage: { ...data.onSiteFootage, notes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      <KnowledgeViewDialog
        knowledgeItems={linkedKnowledge}
        open={showKnowledge}
        onClose={() => setShowKnowledge(false)}
      />
    </div>
  );
}
