'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import type { Designs } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface Step7Props {
  data: Designs;
  onChange: (data: Designs) => void;
  onBlur: () => void;
  productionId?: string;
  getLinkedItems?: (section: string) => KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignments?: Record<string, string>;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step7Designs({
  data,
  onChange,
  onBlur,
  productionId,
  getLinkedItems,
  onKnowledgeChange,
  assignments,
  onAssignmentChange,
}: Step7Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState<string | null>(null);

  // Get linked items for each section
  const linkedStep7 = getLinkedItems?.('step7') || [];
  const linkedBackdrop = getLinkedItems?.('step7_backdrop') || [];
  const linkedBanner = getLinkedItems?.('step7_banner') || [];

  const renderSectionButtons = (section: string, linkedItems: KnowledgeBaseItem[]) => (
    <div className="flex gap-2">
      {onKnowledgeChange && (
        <>
          <KnowledgeLinkButton
            section={section}
            linkedIds={linkedItems.map(k => k._id)}
            onChange={onKnowledgeChange}
          />
          {linkedItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowKnowledge(section)}
            >
              {t('view')} ({linkedItems.length})
            </Button>
          )}
        </>
      )}
      {productionId && onAssignmentChange && (
        <AssignButton
          section={section}
          assignedUserId={assignments?.[section]}
          productionId={productionId}
          onChange={onAssignmentChange}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step7')}</h3>
          <p className="text-gray-600">Backdrop & Banner Design</p>
        </div>
        {renderSectionButtons('step7', linkedStep7)}
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
          <div className="flex justify-between items-start gap-4">
            <CardTitle>7.1 Backdrop Design (3.5m x 2.5m)</CardTitle>
            {renderSectionButtons('step7_backdrop', linkedBackdrop)}
          </div>
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
          <div className="flex justify-between items-start gap-4">
            <CardTitle>7.2 Rollup Banner Design (33.5&quot; x 80&quot;)</CardTitle>
            {renderSectionButtons('step7_banner', linkedBanner)}
          </div>
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

      {/* Knowledge View Dialogs */}
      <KnowledgeViewDialog
        knowledgeItems={linkedStep7}
        open={showKnowledge === 'step7'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linkedBackdrop}
        open={showKnowledge === 'step7_backdrop'}
        onClose={() => setShowKnowledge(null)}
      />
      <KnowledgeViewDialog
        knowledgeItems={linkedBanner}
        open={showKnowledge === 'step7_banner'}
        onClose={() => setShowKnowledge(null)}
      />
    </div>
  );
}
