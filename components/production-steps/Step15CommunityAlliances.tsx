'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, ExternalLink, Save } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import type { CommunityAlliance } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';
import type { Community } from '@/types/community';

interface Step15Props {
  data: CommunityAlliance[];
  onChange: (data: CommunityAlliance[]) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignedUserId?: string;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step15CommunityAlliances({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange,
  assignedUserId,
  onAssignmentChange,
}: Step15Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities');
      if (response.ok) {
        const data = await response.json();
        setCommunities(data);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const addAlliance = () => {
    const newAlliance: CommunityAlliance = {
      id: Date.now().toString(),
      communityId: '',
      communityName: '',
      allianceDetail: '',
      files: '',
      note: '',
    };
    onChange([...data, newAlliance]);
  };

  const removeAlliance = (id: string) => {
    onChange(data.filter((alliance) => alliance.id !== id));
  };

  const updateAlliance = (id: string, field: keyof CommunityAlliance, value: string) => {
    onChange(
      data.map((alliance) => (alliance.id === id ? { ...alliance, [field]: value } : alliance))
    );
  };

  const handleCommunitySelect = (allianceId: string, communityId: string) => {
    const community = communities.find((c) => c._id === communityId);
    onChange(
      data.map((alliance) =>
        alliance.id === allianceId
          ? {
              ...alliance,
              communityId: communityId,
              communityName: community?.name || '',
            }
          : alliance
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step15')}</h3>
          <p className="text-gray-600">Community Alliance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTimeout(onBlur, 100)} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          {onKnowledgeChange && (
            <>
              <KnowledgeLinkButton
                section="step15"
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
              section="step15"
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
            No community alliances added yet. Click "Add Alliance" below.
          </div>
        )}

        {data.map((alliance, index) => (
          <Card key={alliance.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Alliance {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeAlliance(alliance.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>
                    Community <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={alliance.communityId}
                    onValueChange={(value) => handleCommunitySelect(alliance.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map((community) => (
                        <SelectItem key={community._id} value={community._id}>
                          {community.name}
                          {community.city && ` - ${community.city}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {communities.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      No communities available. Please add communities first.
                    </p>
                  )}
                </div>

                <div>
                  <Label>Alliance Details</Label>
                  <Textarea
                    placeholder="Describe the alliance details, responsibilities, benefits..."
                    rows={4}
                    value={alliance.allianceDetail}
                    onChange={(e) => updateAlliance(alliance.id, 'allianceDetail', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Files</Label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={alliance.files}
                      onChange={(e) => updateAlliance(alliance.id, 'files', e.target.value)}
                      className="flex-1"
                    />
                    {alliance.files && (
                      <a
                        href={alliance.files}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Link to Google Drive folder with alliance documents
                  </p>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Add any additional notes..."
                    rows={2}
                    value={alliance.note}
                    onChange={(e) => updateAlliance(alliance.id, 'note', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addAlliance} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Alliance
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
