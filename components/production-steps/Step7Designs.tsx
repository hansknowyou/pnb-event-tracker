'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Designs } from '@/types/production';

interface Step7Props {
  data: Designs;
  onChange: (data: Designs) => void;
  onBlur: () => void;
}

export default function Step7Designs({ data, onChange, onBlur }: Step7Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Step 7: 背景版与易拉宝设计</h3>
        <p className="text-gray-600">Backdrop & Banner Design</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-sm">
        <h4 className="font-semibold text-blue-900">Design Requirements:</h4>
        <div className="text-blue-800 space-y-1">
          <p><strong>Purpose:</strong></p>
          <ul className="list-disc ml-5">
            <li>Backdrop: For venue photo ops, media press conference backdrop</li>
            <li>Rollup Banner: For media press conference</li>
          </ul>
          <p className="mt-2"><strong>Must Include:</strong></p>
          <ul className="list-disc ml-5">
            <li>All sponsor/organizer/executor logos and text</li>
            <li>All acknowledgment units</li>
            <li>Performance date, time, location, venue</li>
            <li>Performance title</li>
            <li>Performance visual design</li>
          </ul>
        </div>
      </div>

      {/* 7.1 Backdrop Design */}
      <Card>
        <CardHeader>
          <CardTitle>7.1 Backdrop Design (3.5m x 2.5m)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Source File Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.backdrop.sourceFile}
              onChange={(e) => onChange({
                ...data,
                backdrop: { ...data.backdrop, sourceFile: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>

          <div>
            <Label>PDF Print File Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.backdrop.pdfFile}
              onChange={(e) => onChange({
                ...data,
                backdrop: { ...data.backdrop, pdfFile: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>

          <div>
            <Label>PNG File (3000px) Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.backdrop.pngFile}
              onChange={(e) => onChange({
                ...data,
                backdrop: { ...data.backdrop, pngFile: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>

          <div>
            <Label>Ticketing QR Codes Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.backdrop.qrCodes}
              onChange={(e) => onChange({
                ...data,
                backdrop: { ...data.backdrop, qrCodes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>

          <div>
            <Label>Platform Tracking QR Codes Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.backdrop.trackingQrCodes}
              onChange={(e) => onChange({
                ...data,
                backdrop: { ...data.backdrop, trackingQrCodes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.backdrop.notes}
              onChange={(e) => onChange({
                ...data,
                backdrop: { ...data.backdrop, notes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>

      {/* 7.2 Rollup Banner Design */}
      <Card>
        <CardHeader>
          <CardTitle>7.2 Rollup Banner Design (33.5&quot; x 80&quot;)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Source File Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.rollupBanner.sourceFile}
              onChange={(e) => onChange({
                ...data,
                rollupBanner: { ...data.rollupBanner, sourceFile: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>

          <div>
            <Label>PDF Print File Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.rollupBanner.pdfFile}
              onChange={(e) => onChange({
                ...data,
                rollupBanner: { ...data.rollupBanner, pdfFile: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>

          <div>
            <Label>PNG File (3000px) Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.rollupBanner.pngFile}
              onChange={(e) => onChange({
                ...data,
                rollupBanner: { ...data.rollupBanner, pngFile: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>

          <div>
            <Label>Ticketing QR Codes Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.rollupBanner.qrCodes}
              onChange={(e) => onChange({
                ...data,
                rollupBanner: { ...data.rollupBanner, qrCodes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>

          <div>
            <Label>Platform Tracking QR Codes Link</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={data.rollupBanner.trackingQrCodes}
              onChange={(e) => onChange({
                ...data,
                rollupBanner: { ...data.rollupBanner, trackingQrCodes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Notes..."
              rows={2}
              value={data.rollupBanner.notes}
              onChange={(e) => onChange({
                ...data,
                rollupBanner: { ...data.rollupBanner, notes: e.target.value }
              })}
              onBlur={onBlur}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
