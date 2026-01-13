'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Itinerary } from '@/types/production';

interface Step4Props {
  data: Itinerary;
  onChange: (data: Itinerary) => void;
  onBlur: () => void;
}

export default function Step4Itinerary({ data, onChange, onBlur }: Step4Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Step 4: 演出团队行程</h3>
        <p className="text-gray-600">Team Itinerary</p>
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
    </div>
  );
}
