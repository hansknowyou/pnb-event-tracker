'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Save } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import VenueLinkButton from '@/components/VenueLinkButton';
import type { VenueInfo } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';
import type { Venue } from '@/types/venue';

interface Step6Props {
  data: VenueInfo[];
  onChange: (data: VenueInfo[]) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignedUserId?: string;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step6VenueInfo({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange,
  assignedUserId,
  onAssignmentChange,
}: Step6Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState(false);
  const addVenue = () => {
    const newVenue: VenueInfo = {
      id: Date.now().toString(),
      linkedVenueId: undefined,
      venueName: '',
      address: '',
      contacts: '',
      otherInfo: '',
      requiredForms: { link: '', notes: '' },
      ticketDesign: { link: '', pricing: '' },
      seatMap: { link: '', notes: '' },
      ticketLink: { link: '', notes: '' },
    };
    onChange([...data, newVenue]);
  };

  const handleVenueLink = (venueInfoId: string, linkedVenue: Venue | null) => {
    // When linking a venue, automatically set the venue name
    updateVenue(venueInfoId, {
      linkedVenueId: linkedVenue?._id,
      venueName: linkedVenue?.name || '',
    });
  };

  const handleVenueImport = (venueInfoId: string, linkedVenue: Venue) => {
    // Import all venue data into the form fields
    const staffContacts = linkedVenue.staff
      ?.map((s) => `${s.name} (${s.role}) - ${s.email} / ${s.phone}`)
      .join('\n') || '';

    updateVenue(venueInfoId, {
      linkedVenueId: linkedVenue._id,
      venueName: linkedVenue.name,
      address: linkedVenue.location || '',
      contacts: staffContacts,
      otherInfo: linkedVenue.intro || '',
    });
  };

  const removeVenue = (id: string) => {
    onChange(data.filter((v) => v.id !== id));
  };

  const updateVenue = (id: string, updates: Partial<VenueInfo>) => {
    onChange(
      data.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step6')}</h3>
          <p className="text-gray-600">Venue Information</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTimeout(onBlur, 100)} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          {onKnowledgeChange && (
            <>
              <KnowledgeLinkButton
                section="step6"
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
              section="step6"
              assignedUserId={assignedUserId}
              productionId={productionId}
              onChange={onAssignmentChange}
            />
          )}
        </div>
      </div>

      <div className="space-y-6">
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No venues added yet. Click "Add Venue" below.
          </div>
        )}

        {data.map((venue, index) => (
          <Card key={venue.id} className="border-2">
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h4 className="text-xl font-semibold">Venue {index + 1}</h4>
                  <VenueLinkButton
                    linkedVenueId={venue.linkedVenueId}
                    onSelect={(v) => handleVenueLink(venue.id, v)}
                    onImport={(v) => handleVenueImport(venue.id, v)}
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

              {/* 6.1 Basic Info */}
              <div className="space-y-4 pb-4 border-b">
                <h5 className="font-semibold text-sm text-gray-700">6.1 Basic Information</h5>

                <div>
                  <Label>Venue Name {!venue.linkedVenueId && <span className="text-red-500">*</span>}</Label>
                  <Input
                    placeholder={venue.linkedVenueId ? "Linked from venue database" : "e.g., Lincoln Center"}
                    value={venue.venueName}
                    onChange={(e) => updateVenue(venue.id, { venueName: e.target.value })}
                                        disabled={!!venue.linkedVenueId}
                    className={venue.linkedVenueId ? "bg-gray-50" : ""}
                  />
                  {venue.linkedVenueId && (
                    <p className="text-xs text-gray-500 mt-1">Venue name is automatically set from the linked venue</p>
                  )}
                </div>

                <div>
                  <Label>Address <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Full address"
                    value={venue.address}
                    onChange={(e) => updateVenue(venue.id, { address: e.target.value })}
                                      />
                </div>

                <div>
                  <Label>Contact Person(s)</Label>
                  <Textarea
                    placeholder="List of contact persons..."
                    rows={2}
                    value={venue.contacts}
                    onChange={(e) => updateVenue(venue.id, { contacts: e.target.value })}
                                      />
                </div>

                <div>
                  <Label>Other Information</Label>
                  <Textarea
                    placeholder="Any other relevant info..."
                    rows={2}
                    value={venue.otherInfo}
                    onChange={(e) => updateVenue(venue.id, { otherInfo: e.target.value })}
                                      />
                </div>
              </div>

              {/* 6.2 Required Forms */}
              <div className="space-y-4 pb-4 border-b">
                <h5 className="font-semibold text-sm text-gray-700">6.2 Venue Required Forms</h5>

                <div>
                  <Label>Forms Link</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={venue.requiredForms.link}
                    onChange={(e) => updateVenue(venue.id, {
                      requiredForms: { ...venue.requiredForms, link: e.target.value }
                    })}
                                      />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Notes about forms..."
                    rows={2}
                    value={venue.requiredForms.notes}
                    onChange={(e) => updateVenue(venue.id, {
                      requiredForms: { ...venue.requiredForms, notes: e.target.value }
                    })}
                                      />
                </div>
              </div>

              {/* 6.3 Ticket Design & Pricing */}
              <div className="space-y-4 pb-4 border-b">
                <h5 className="font-semibold text-sm text-gray-700">6.3 Ticket Design & Pricing</h5>

                <div>
                  <Label>Ticket Design Link</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={venue.ticketDesign.link}
                    onChange={(e) => updateVenue(venue.id, {
                      ticketDesign: { ...venue.ticketDesign, link: e.target.value }
                    })}
                                      />
                </div>

                <div>
                  <Label>Pricing Information</Label>
                  <Textarea
                    placeholder="Ticket pricing details..."
                    rows={2}
                    value={venue.ticketDesign.pricing}
                    onChange={(e) => updateVenue(venue.id, {
                      ticketDesign: { ...venue.ticketDesign, pricing: e.target.value }
                    })}
                                      />
                </div>
              </div>

              {/* 6.4 Seat Map */}
              <div className="space-y-4 pb-4 border-b">
                <h5 className="font-semibold text-sm text-gray-700">6.4 Reserved Seat Map</h5>

                <div>
                  <Label>Seat Map Link</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={venue.seatMap.link}
                    onChange={(e) => updateVenue(venue.id, {
                      seatMap: { ...venue.seatMap, link: e.target.value }
                    })}
                                      />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Notes about seat map..."
                    rows={2}
                    value={venue.seatMap.notes}
                    onChange={(e) => updateVenue(venue.id, {
                      seatMap: { ...venue.seatMap, notes: e.target.value }
                    })}
                                      />
                </div>
              </div>

              {/* 6.5 Ticket Link */}
              <div className="space-y-4">
                <h5 className="font-semibold text-sm text-gray-700">6.5 Ticketing Link</h5>

                <div>
                  <Label>Ticket Purchase Link</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={venue.ticketLink.link}
                    onChange={(e) => updateVenue(venue.id, {
                      ticketLink: { ...venue.ticketLink, link: e.target.value }
                    })}
                                      />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Notes about ticketing..."
                    rows={2}
                    value={venue.ticketLink.notes}
                    onChange={(e) => updateVenue(venue.id, {
                      ticketLink: { ...venue.ticketLink, notes: e.target.value }
                    })}
                                      />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addVenue} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Venue
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
