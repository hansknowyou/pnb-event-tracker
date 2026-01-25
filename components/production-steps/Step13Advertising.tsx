'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import type { Advertising, TargetAudience, OfflineAdvertising } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface Step13Props {
  data: Advertising;
  onChange: (data: Advertising) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignedUserId?: string;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step13Advertising({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange,
  assignedUserId,
  onAssignmentChange,
}: Step13Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState(false);
  // Online advertising management
  const addOnline = () => {
    const newOnline: TargetAudience = {
      id: Date.now().toString(),
      platformName: '',
      targetAudience: [],
      resourceLink: '',
      notes: '',
    };
    onChange({ ...data, online: [...data.online, newOnline] });
  };

  const removeOnline = (id: string) => {
    onChange({ ...data, online: data.online.filter((o) => o.id !== id) });
  };

  const updateOnline = (id: string, field: keyof TargetAudience, value: any) => {
    onChange({
      ...data,
      online: data.online.map((o) =>
        o.id === id ? { ...o, [field]: value } : o
      ),
    });
  };

  const toggleOnlineAudience = (id: string, audience: 'chinese' | 'western') => {
    const item = data.online.find((o) => o.id === id);
    if (!item) return;

    const newAudience = item.targetAudience.includes(audience)
      ? item.targetAudience.filter((a) => a !== audience)
      : [...item.targetAudience, audience];

    updateOnline(id, 'targetAudience', newAudience);
  };

  // Offline advertising management
  const addOffline = () => {
    const newOffline: OfflineAdvertising = {
      id: Date.now().toString(),
      organizationName: '',
      targetAudience: [],
      googleResourceLink: '',
      notes: '',
    };
    onChange({ ...data, offline: [...data.offline, newOffline] });
  };

  const removeOffline = (id: string) => {
    onChange({ ...data, offline: data.offline.filter((o) => o.id !== id) });
  };

  const updateOffline = (id: string, field: keyof OfflineAdvertising, value: any) => {
    onChange({
      ...data,
      offline: data.offline.map((o) =>
        o.id === id ? { ...o, [field]: value } : o
      ),
    });
  };

  const toggleOfflineAudience = (id: string, audience: 'chinese' | 'western') => {
    const item = data.offline.find((o) => o.id === id);
    if (!item) return;

    const newAudience = item.targetAudience.includes(audience)
      ? item.targetAudience.filter((a) => a !== audience)
      : [...item.targetAudience, audience];

    updateOffline(id, 'targetAudience', newAudience);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step13')}</h3>
          <p className="text-gray-600">Advertising</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTimeout(onBlur, 100)} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          {onKnowledgeChange && (
            <>
              <KnowledgeLinkButton
                section="step13"
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
              section="step13"
              assignedUserId={assignedUserId}
              productionId={productionId}
              onChange={onAssignmentChange}
            />
          )}
        </div>
      </div>

      {/* Online Advertising */}
      <Card>
        <CardHeader>
          <CardTitle>Online Advertising</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.online.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No online advertising added yet.
            </div>
          )}

          {data.online.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Online Platform {index + 1}</h5>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeOnline(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label>Platform Name</Label>
                <Input
                  placeholder="e.g., Google Ads, Facebook Ads, WeChat Ads"
                  value={item.platformName}
                  onChange={(e) => updateOnline(item.id, 'platformName', e.target.value)}
                                  />
              </div>

              <div>
                <Label className="mb-2 block">Target Audience</Label>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`online-chinese-${item.id}`}
                      checked={item.targetAudience.includes('chinese')}
                      onCheckedChange={() => toggleOnlineAudience(item.id, 'chinese')}
                    />
                    <Label htmlFor={`online-chinese-${item.id}`} className="cursor-pointer">
                      Chinese (华人)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`online-western-${item.id}`}
                      checked={item.targetAudience.includes('western')}
                      onCheckedChange={() => toggleOnlineAudience(item.id, 'western')}
                    />
                    <Label htmlFor={`online-western-${item.id}`} className="cursor-pointer">
                      Western (西人)
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Resource Link</Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={item.resourceLink}
                  onChange={(e) => updateOnline(item.id, 'resourceLink', e.target.value)}
                                  />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Notes..."
                  rows={2}
                  value={item.notes}
                  onChange={(e) => updateOnline(item.id, 'notes', e.target.value)}
                                  />
              </div>
            </div>
          ))}

          <Button onClick={addOnline} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Online Platform
          </Button>
        </CardContent>
      </Card>

      {/* Offline Collaboration */}
      <Card>
        <CardHeader>
          <CardTitle>Offline Collaboration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.offline.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No offline collaboration added yet.
            </div>
          )}

          {data.offline.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Organization/Community {index + 1}</h5>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeOffline(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label>Organization/Community Name</Label>
                <Input
                  placeholder="e.g., Local Chinese Association, Community Center"
                  value={item.organizationName}
                  onChange={(e) => updateOffline(item.id, 'organizationName', e.target.value)}
                                  />
              </div>

              <div>
                <Label className="mb-2 block">Target Audience</Label>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`offline-chinese-${item.id}`}
                      checked={item.targetAudience.includes('chinese')}
                      onCheckedChange={() => toggleOfflineAudience(item.id, 'chinese')}
                    />
                    <Label htmlFor={`offline-chinese-${item.id}`} className="cursor-pointer">
                      Chinese (华人)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`offline-western-${item.id}`}
                      checked={item.targetAudience.includes('western')}
                      onCheckedChange={() => toggleOfflineAudience(item.id, 'western')}
                    />
                    <Label htmlFor={`offline-western-${item.id}`} className="cursor-pointer">
                      Western (西人)
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Google Resource Link</Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={item.googleResourceLink}
                  onChange={(e) => updateOffline(item.id, 'googleResourceLink', e.target.value)}
                                  />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Notes..."
                  rows={2}
                  value={item.notes}
                  onChange={(e) => updateOffline(item.id, 'notes', e.target.value)}
                                  />
              </div>
            </div>
          ))}

          <Button onClick={addOffline} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Offline Collaboration
          </Button>
        </CardContent>
      </Card>

      <KnowledgeViewDialog
        knowledgeItems={linkedKnowledge}
        open={showKnowledge}
        onClose={() => setShowKnowledge(false)}
      />
    </div>
  );
}
