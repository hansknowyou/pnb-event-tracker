'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import VenueLinkButton from '@/components/VenueLinkButton';
import type { VenueContract } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';
import type { Venue } from '@/types/venue';

interface Step3Props {
  data: VenueContract[];
  onChange: (data: VenueContract[]) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignedUserId?: string;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step3VenueContracts({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange,
  assignedUserId,
  onAssignmentChange,
}: Step3Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState(false);
  const addVenue = () => {
    const newVenue: VenueContract = {
      id: Date.now().toString(),
      linkedVenueId: undefined,
      venueName: '',
      contractLink: '',
      notes: '',
    };
    onChange([...data, newVenue]);
  };

  const handleVenueLink = (contractId: string, linkedVenue: Venue | null) => {
    // When linking a venue, automatically set the venue name
    onChange(
      data.map((v) =>
        v.id === contractId
          ? {
              ...v,
              linkedVenueId: linkedVenue?._id || undefined,
              venueName: linkedVenue?.name || v.venueName
            }
          : v
      )
    );
    onBlur();
  };

  const removeVenue = (id: string) => {
    onChange(data.filter((venue) => venue.id !== id));
  };

  const updateVenue = (id: string, field: keyof VenueContract, value: string) => {
    onChange(
      data.map((venue) => (venue.id === id ? { ...venue, [field]: value } : venue))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step3')}</h3>
          <p className="text-gray-600">Venue Contracts</p>
        </div>
        <div className="flex gap-2">
          {onKnowledgeChange && (
            <>
              <KnowledgeLinkButton
                section="step3"
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
              section="step3"
              assignedUserId={assignedUserId}
              productionId={productionId}
              onChange={onAssignmentChange}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No venue contracts added yet. Click "Add Venue Contract" below.
          </div>
        )}

        {data.map((venue, index) => (
          <Card key={venue.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h4 className="font-semibold">Venue {index + 1}</h4>
                  <VenueLinkButton
                    linkedVenueId={venue.linkedVenueId}
                    onSelect={(v) => handleVenueLink(venue.id, v)}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVenue(venue.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>
                    Venue Name {!venue.linkedVenueId && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    placeholder={venue.linkedVenueId ? "Linked from venue database" : "e.g., Lincoln Center"}
                    value={venue.venueName}
                    onChange={(e) => updateVenue(venue.id, 'venueName', e.target.value)}
                    onBlur={onBlur}
                    disabled={!!venue.linkedVenueId}
                    className={venue.linkedVenueId ? "bg-gray-50" : ""}
                  />
                  {venue.linkedVenueId && (
                    <p className="text-xs text-gray-500 mt-1">Venue name is automatically set from the linked venue</p>
                  )}
                </div>

                <div>
                  <Label>
                    Contract Link <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={venue.contractLink}
                    onChange={(e) => updateVenue(venue.id, 'contractLink', e.target.value)}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Add any notes..."
                    rows={3}
                    value={venue.notes}
                    onChange={(e) => updateVenue(venue.id, 'notes', e.target.value)}
                    onBlur={onBlur}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addVenue} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Venue Contract
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
