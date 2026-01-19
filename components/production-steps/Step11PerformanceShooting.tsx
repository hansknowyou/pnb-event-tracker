'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-sm">
        <h4 className="font-semibold text-blue-900">HD Version Requirements:</h4>
        <ul className="list-disc ml-5 text-blue-800 space-y-1">
          <li>Professional HD equipment</li>
          <li>At least dual camera setup: fixed + roaming</li>
          <li>Performance close-ups and extreme close-ups</li>
          <li>Multiple classic dance segments close-ups + extreme close-ups (10+ seconds)</li>
          <li>Multiple classic segments with original audio</li>
          <li>Audience side shots, individual audience close-ups</li>
          <li>Theater exterior establishing shots, iconic detail close-ups</li>
          <li>Director and lead cast interviews, post-show audience interviews</li>
          <li>Actor makeup and backstage footage, crew behind-the-scenes</li>
          <li>No on-stage shooting after performance starts - shoot from wings and house</li>
        </ul>

        <h4 className="font-semibold text-blue-900 mt-4">Mobile Version Requirements:</h4>
        <ul className="list-disc ml-5 text-blue-800 space-y-1">
          <li>Mobile phone shooting</li>
          <li>Horizontal and vertical formats (must ensure internal phone footage)</li>
          <li>Original on-site audio</li>
          <li>Full show from multiple angles</li>
          <li>Backstage and on-site interview supplementary footage</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="drive-link">
            Google Drive Link <span className="text-red-500">*</span>
          </Label>
          <Input
            id="drive-link"
            type="url"
            placeholder="https://drive.google.com/..."
            value={data.googleDriveLink}
            onChange={(e) => onChange({ ...data, googleDriveLink: e.target.value })}
            onBlur={onBlur}
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
            onBlur={onBlur}
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
