'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Contract } from '@/types/production';

interface Step1Props {
  data: Contract;
  onChange: (data: Contract) => void;
  onBlur: () => void;
}

export default function Step1Contract({ data, onChange, onBlur }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Step 1: 演出合同签订</h3>
        <p className="text-gray-600">Contract Signing</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="contract-link">
            Contract Link <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contract-link"
            type="url"
            placeholder="https://..."
            value={data.link}
            onChange={(e) => onChange({ ...data, link: e.target.value })}
            onBlur={onBlur}
          />
        </div>

        <div>
          <Label htmlFor="contract-notes">Notes</Label>
          <Textarea
            id="contract-notes"
            placeholder="Add any notes about the contract..."
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
