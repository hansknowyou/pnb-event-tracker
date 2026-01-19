'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import type { Videos } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step9')}</h3>
          <p className="text-gray-600">Video Production</p>
        </div>
        <div className="flex gap-2">
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

      {/* 9.1 Conference Loop Video */}
      <Card>
        <CardHeader>
          <CardTitle>9.1 Press Conference Loop Video (16:9)</CardTitle>
          <p className="text-sm text-gray-600">
            6-10 slides including: title, cast, program, date/time/location, organizers, logo page
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Video Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.conferenceLoop.link}
              onChange={(e) => onChange({
                ...data,
                conferenceLoop: { ...data.conferenceLoop, link: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.conferenceLoop.notes}
              onChange={(e) => onChange({
                ...data,
                conferenceLoop: { ...data.conferenceLoop, notes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      {/* 9.2 Main Promo Video */}
      <Card>
        <CardHeader>
          <CardTitle>9.2 Main Promotional Video (16:9 - Trailer Style)</CardTitle>
          <p className="text-sm text-gray-600">
            Performance clips montage + organizer logos + date/time/location
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Video Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.mainPromo.link}
              onChange={(e) => onChange({
                ...data,
                mainPromo: { ...data.mainPromo, link: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.mainPromo.notes}
              onChange={(e) => onChange({
                ...data,
                mainPromo: { ...data.mainPromo, notes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      {/* 9.3 Actor Intro Video */}
      <Card>
        <CardHeader>
          <CardTitle>9.3 Actor Introduction Video (16:9)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Video Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.actorIntro.link}
              onChange={(e) => onChange({
                ...data,
                actorIntro: { ...data.actorIntro, link: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.actorIntro.notes}
              onChange={(e) => onChange({
                ...data,
                actorIntro: { ...data.actorIntro, notes: e.target.value }
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
