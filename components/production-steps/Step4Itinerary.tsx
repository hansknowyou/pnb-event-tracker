'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import type { Itinerary } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface Step4Props {
  data: Itinerary;
  onChange: (data: Itinerary) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
}

export default function Step4Itinerary({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange
}: Step4Props) {
  const [showKnowledge, setShowKnowledge] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">Step 4: 演出团队行程</h3>
          <p className="text-gray-600">Team Itinerary</p>
        </div>
        {productionId && onKnowledgeChange && (
          <div className="flex gap-2">
            <KnowledgeLinkButton
              section="step4"
              linkedIds={linkedKnowledge.map(k => k._id)}
              productionId={productionId}
              onChange={onKnowledgeChange}
            />
            {linkedKnowledge.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKnowledge(true)}
              >
                View Knowledge ({linkedKnowledge.length})
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="itinerary-link">
            Itinerary Link <span className="text-red-500">*</span>
          </Label>
          <Input
            id="itinerary-link"
            type="url"
            placeholder="https://..."
            value={data.link}
            onChange={(e) => onChange({ ...data, link: e.target.value })}
            onBlur={onBlur}
          />
        </div>

        <div>
          <Label htmlFor="itinerary-notes">Notes</Label>
          <Textarea
            id="itinerary-notes"
            placeholder="Add any notes about the itinerary..."
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
