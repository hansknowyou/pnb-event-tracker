'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { VenueContract } from '@/types/production';

interface Step3Props {
  data: VenueContract[];
  onChange: (data: VenueContract[]) => void;
  onBlur: () => void;
}

export default function Step3VenueContracts({ data, onChange, onBlur }: Step3Props) {
  const addVenue = () => {
    const newVenue: VenueContract = {
      id: Date.now().toString(),
      venueName: '',
      contractLink: '',
      notes: '',
    };
    onChange([...data, newVenue]);
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
      <div>
        <h3 className="text-2xl font-bold mb-2">Step 3: 场馆合同签订</h3>
        <p className="text-gray-600">Venue Contracts</p>
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
                <h4 className="font-semibold">Venue {index + 1}</h4>
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
                    Venue Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., Lincoln Center"
                    value={venue.venueName}
                    onChange={(e) => updateVenue(venue.id, 'venueName', e.target.value)}
                    onBlur={onBlur}
                  />
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
    </div>
  );
}
