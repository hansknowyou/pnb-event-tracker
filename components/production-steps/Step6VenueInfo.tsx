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
import PreviewLink from '@/components/PreviewLink';
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
  const [openVenueId, setOpenVenueId] = useState<string | null>(null);
  const addVenue = () => {
    const newVenue: VenueInfo = {
      id: Date.now().toString(),
      linkedVenueId: undefined,
      venueName: '',
      address: '',
      contacts: '',
      otherInfo: '',
      previewImage: '',
      requiredForms: { link: '', notes: '' },
      ticketDesign: { link: '', pricing: '' },
      seatMap: { link: '', notes: '' },
      ticketLink: { link: '', notes: '' },
    };
    onChange([...data, newVenue]);
    setOpenVenueId(newVenue.id);
  };

  const handleVenueLink = (venueInfoId: string, linkedVenue: Venue | null) => {
    updateVenue(venueInfoId, {
      linkedVenueId: linkedVenue?._id,
      venueName: linkedVenue?.name || '',
      address: linkedVenue?.location || '',
      contacts:
        linkedVenue?.staff
          ?.map((s) => `${s.name} (${s.role?.join(', ') || ''}) - ${s.email} / ${s.phone}`)
          .join('\n') || '',
      otherInfo: linkedVenue?.notes || linkedVenue?.intro || '',
      previewImage: linkedVenue?.image || '',
    });
  };

  const handleVenueImport = (venueInfoId: string, linkedVenue: Venue) => {
    handleVenueLink(venueInfoId, linkedVenue);
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setOpenVenueId((current) => (current === venue.id ? null : venue.id))
                    }
                  >
                    {openVenueId === venue.id ? 'Collapse' : 'Expand'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeVenue(venue.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {openVenueId === venue.id && (
                <>
                  {/* Basic Info */}
                  <div className="space-y-4 pb-4 border-b">
                    <h5 className="font-semibold text-sm text-gray-700">Basic Information</h5>

                    {!venue.linkedVenueId && (
                      <p className="text-sm text-gray-500">Link a venue to view its details.</p>
                    )}

                    {venue.linkedVenueId && (
                      <div className="space-y-3">
                        <div>
                          <Label>Venue Name</Label>
                          <p className="text-sm text-gray-800">{venue.venueName || '—'}</p>
                        </div>
                        <div>
                          <Label>Address</Label>
                          <p className="text-sm text-gray-800">{venue.address || '—'}</p>
                        </div>
                        <div>
                          <Label>Preview Image</Label>
                          {venue.previewImage ? (
                            <img
                              src={venue.previewImage}
                              alt={venue.venueName || 'Venue'}
                              className="mt-2 h-32 w-48 rounded-md border object-cover"
                            />
                          ) : (
                            <p className="text-sm text-gray-500">No image available.</p>
                          )}
                        </div>
                        <div>
                          <Label>Contacts</Label>
                          <p className="text-sm text-gray-800 whitespace-pre-line">
                            {venue.contacts || '—'}
                          </p>
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <p className="text-sm text-gray-800 whitespace-pre-line">
                            {venue.otherInfo || '—'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Required Forms */}
                  <div className="space-y-4 pb-4 border-b">
                    <h5 className="font-semibold text-sm text-gray-700">Venue Required Forms</h5>

                    <div>
                      <div className="flex items-center gap-2">
                        <Label className="mb-0">Forms Link</Label>
                        <PreviewLink href={venue.requiredForms.link} />
                      </div>
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

                  {/* Ticket Design & Pricing */}
                  <div className="space-y-4 pb-4 border-b">
                    <h5 className="font-semibold text-sm text-gray-700">Ticket Design & Pricing</h5>

                    <div>
                      <div className="flex items-center gap-2">
                        <Label className="mb-0">Ticket Design Link</Label>
                        <PreviewLink href={venue.ticketDesign.link} />
                      </div>
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

                  {/* Seat Map */}
                  <div className="space-y-4 pb-4 border-b">
                    <h5 className="font-semibold text-sm text-gray-700">Reserved Seat Map</h5>

                    <div>
                      <div className="flex items-center gap-2">
                        <Label className="mb-0">Seat Map Link</Label>
                        <PreviewLink href={venue.seatMap.link} />
                      </div>
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

                  {/* Ticket Link */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-sm text-gray-700">Ticketing Link</h5>

                    <div>
                      <div className="flex items-center gap-2">
                        <Label className="mb-0">Ticket Purchase Link</Label>
                        <PreviewLink href={venue.ticketLink.link} />
                      </div>
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
                </>
              )}
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
