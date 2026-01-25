'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import PreviewLink from '@/components/PreviewLink';
import type { PerformanceShooting } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface Step11Props {
  data: PerformanceShooting;
  onChange: (data: PerformanceShooting) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignedUserId?: string;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step11PerformanceShooting({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange,
  assignedUserId,
  onAssignmentChange,
}: Step11Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step11')}</h3>
          <p className="text-gray-600">Performance Shooting</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTimeout(onBlur, 100)} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          {onKnowledgeChange && (
            <>
              <KnowledgeLinkButton
                section="step11"
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
              section="step11"
              assignedUserId={assignedUserId}
              productionId={productionId}
              onChange={onAssignmentChange}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Label htmlFor="drive-link" className="mb-0">
              Google Drive Link <span className="text-red-500">*</span>
            </Label>
            <PreviewLink href={data.googleDriveLink} />
          </div>
          <Input
            id="drive-link"
            type="url"
            placeholder="https://drive.google.com/..."
            value={data.googleDriveLink}
            onChange={(e) => onChange({ ...data, googleDriveLink: e.target.value })}
                      />
        </div>

        <div>
          <Label htmlFor="shooting-notes">Notes</Label>
          <Textarea
            id="shooting-notes"
            placeholder="Add any notes about the shooting footage..."
            rows={4}
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
                      />
        </div>
      </div>

      <KnowledgeViewDialog
        knowledgeItems={linkedKnowledge}
        open={showKnowledge}
        onClose={() => setShowKnowledge(false)}
      />
    </div>
  );
}
