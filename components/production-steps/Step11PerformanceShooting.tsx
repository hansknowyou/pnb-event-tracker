'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { PerformanceShooting } from '@/types/production';

interface Step11Props {
  data: PerformanceShooting;
  onChange: (data: PerformanceShooting) => void;
  onBlur: () => void;
}

export default function Step11PerformanceShooting({ data, onChange, onBlur }: Step11Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Step 11: 演出拍摄收集</h3>
        <p className="text-gray-600">Performance Shooting</p>
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
    </div>
  );
}
