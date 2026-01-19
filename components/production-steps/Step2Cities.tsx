'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import type { City } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface Step2Props {
  data: City[];
  onChange: (data: City[]) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignedUserId?: string;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step2Cities({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange,
  assignedUserId,
  onAssignmentChange,
}: Step2Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState(false);

  const addCity = () => {
    const newCity: City = {
      id: Date.now().toString(),
      city: '',
      date: '',
      time: '',
      notes: '',
    };
    onChange([...data, newCity]);
  };

  const removeCity = (id: string) => {
    onChange(data.filter((city) => city.id !== id));
  };

  const updateCity = (id: string, field: keyof City, value: string) => {
    onChange(
      data.map((city) => (city.id === id ? { ...city, [field]: value } : city))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step2')}</h3>
          <p className="text-gray-600">Cities & Dates</p>
        </div>
        <div className="flex gap-2">
          {onKnowledgeChange && (
            <>
              <KnowledgeLinkButton
                section="step2"
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
              section="step2"
              assignedUserId={assignedUserId}
              productionId={productionId}
              onChange={onAssignmentChange}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {data.map((city, index) => (
          <Card key={city.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">City {index + 1}</h4>
                {data.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCity(city.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    City Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., New York"
                    value={city.city}
                    onChange={(e) => updateCity(city.id, 'city', e.target.value)}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <Label>
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={city.date}
                    onChange={(e) => updateCity(city.id, 'date', e.target.value)}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <Label>
                    Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    value={city.time}
                    onChange={(e) => updateCity(city.id, 'time', e.target.value)}
                    onBlur={onBlur}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Add any notes..."
                    rows={2}
                    value={city.notes}
                    onChange={(e) => updateCity(city.id, 'notes', e.target.value)}
                    onBlur={onBlur}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addCity} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add City
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
