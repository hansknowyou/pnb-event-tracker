'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { VenueInfo } from '@/types/production';

interface Step6Props {
  data: VenueInfo[];
  onChange: (data: VenueInfo[]) => void;
  onBlur: () => void;
}

export default function Step6VenueInfo({ data, onChange, onBlur }: Step6Props) {
  const addVenue = () => {
    const newVenue: VenueInfo = {
      id: Date.now().toString(),
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
      <div>
        <h3 className="text-2xl font-bold mb-2">Step 6: 场馆信息收集</h3>
        <p className="text-gray-600">Venue Information</p>
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
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-semibold">Venue {index + 1}</h4>
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
                  <Label>Venue Name <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="e.g., Lincoln Center"
                    value={venue.venueName}
                    onChange={(e) => updateVenue(venue.id, { venueName: e.target.value })}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <Label>Address <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Full address"
                    value={venue.address}
                    onChange={(e) => updateVenue(venue.id, { address: e.target.value })}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <Label>Contact Person(s)</Label>
                  <Textarea
                    placeholder="List of contact persons..."
                    rows={2}
                    value={venue.contacts}
                    onChange={(e) => updateVenue(venue.id, { contacts: e.target.value })}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <Label>Other Information</Label>
                  <Textarea
                    placeholder="Any other relevant info..."
                    rows={2}
                    value={venue.otherInfo}
                    onChange={(e) => updateVenue(venue.id, { otherInfo: e.target.value })}
                    onBlur={onBlur}
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
                    onBlur={onBlur}
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
                    onBlur={onBlur}
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
                    onBlur={onBlur}
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
                    onBlur={onBlur}
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
                    onBlur={onBlur}
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
                    onBlur={onBlur}
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
                    onBlur={onBlur}
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
                    onBlur={onBlur}
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
    </div>
  );
}
