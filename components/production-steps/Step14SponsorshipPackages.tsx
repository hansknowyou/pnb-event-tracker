'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, ExternalLink, Save } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import type { SponsorshipPackage } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface Step14Props {
  data: SponsorshipPackage[];
  onChange: (data: SponsorshipPackage[]) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignedUserId?: string;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step14SponsorshipPackages({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange,
  assignedUserId,
  onAssignmentChange,
}: Step14Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState(false);

  const addPackage = () => {
    const newPackage: SponsorshipPackage = {
      id: Date.now().toString(),
      name: '',
      planDetail: '',
      fileLink: '',
      note: '',
    };
    onChange([...data, newPackage]);
  };

  const removePackage = (id: string) => {
    onChange(data.filter((pkg) => pkg.id !== id));
  };

  const updatePackage = (id: string, field: keyof SponsorshipPackage, value: string) => {
    onChange(
      data.map((pkg) => (pkg.id === id ? { ...pkg, [field]: value } : pkg))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step14')}</h3>
          <p className="text-gray-600">Sponsorship Package Planning</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTimeout(onBlur, 100)} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          {onKnowledgeChange && (
            <>
              <KnowledgeLinkButton
                section="step14"
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
              section="step14"
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
            No sponsorship packages added yet. Click "Add Package" below.
          </div>
        )}

        {data.map((pkg, index) => (
          <Card key={pkg.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Package {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removePackage(pkg.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>
                    Package Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., Gold Sponsor Package"
                    value={pkg.name}
                    onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                                      />
                </div>

                <div>
                  <Label>Plan Details</Label>
                  <Textarea
                    placeholder="Describe the sponsorship package details, benefits, pricing..."
                    rows={4}
                    value={pkg.planDetail}
                    onChange={(e) => updatePackage(pkg.id, 'planDetail', e.target.value)}
                                      />
                </div>

                <div>
                  <Label>File Link</Label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={pkg.fileLink}
                      onChange={(e) => updatePackage(pkg.id, 'fileLink', e.target.value)}
                                            className="flex-1"
                    />
                    {pkg.fileLink && (
                      <a
                        href={pkg.fileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Add any additional notes..."
                    rows={2}
                    value={pkg.note}
                    onChange={(e) => updatePackage(pkg.id, 'note', e.target.value)}
                                      />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addPackage} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Package
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
