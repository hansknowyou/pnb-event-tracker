'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save } from 'lucide-react';
import KnowledgeLinkButton from '@/components/KnowledgeLinkButton';
import KnowledgeViewDialog from '@/components/KnowledgeViewDialog';
import AssignButton from '@/components/AssignButton';
import PreviewLink from '@/components/PreviewLink';
import type { MeetUp } from '@/types/production';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface Step17Props {
  data: MeetUp[];
  onChange: (data: MeetUp[]) => void;
  onBlur: () => void;
  productionId?: string;
  linkedKnowledge?: KnowledgeBaseItem[];
  onKnowledgeChange?: () => void;
  assignedUserId?: string;
  onAssignmentChange?: (section: string, userId: string | null) => void;
}

export default function Step17Meetups({
  data,
  onChange,
  onBlur,
  productionId,
  linkedKnowledge = [],
  onKnowledgeChange,
  assignedUserId,
  onAssignmentChange,
}: Step17Props) {
  const t = useTranslations('knowledgeLink');
  const tStep = useTranslations('stepConfig');
  const [showKnowledge, setShowKnowledge] = useState(false);

  const addMeetup = () => {
    const nextItem: MeetUp = {
      id: Date.now().toString(),
      title: '',
      datetime: '',
      location: '',
      description: '',
      fileLink: '',
      notes: '',
    };
    onChange([...(data || []), nextItem]);
  };

  const updateMeetup = (id: string, updates: Partial<MeetUp>) => {
    onChange((data || []).map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeMeetup = (id: string) => {
    onChange((data || []).filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{tStep('step17')}</h3>
          <p className="text-gray-600">Meet-ups 见面会</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTimeout(onBlur, 100)} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          {onKnowledgeChange && (
            <>
              <KnowledgeLinkButton
                section="step17"
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
              section="step17"
              assignedUserId={assignedUserId}
              productionId={productionId}
              onChange={onAssignmentChange}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {(data || []).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No meet-ups added yet. Click "Add Meet-up" below.
          </div>
        )}

        {(data || []).map((item, index) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle>Meet-up {index + 1} · {item.title || 'Untitled'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => removeMeetup(item.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Meet-up title"
                  value={item.title}
                  onChange={(e) => updateMeetup(item.id, { title: e.target.value })}
                />
              </div>
              <div>
                <Label>Date & Time</Label>
                <Input
                  placeholder="YYYY-MM-DD HH:mm"
                  value={item.datetime}
                  onChange={(e) => updateMeetup(item.id, { datetime: e.target.value })}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  placeholder="Location"
                  value={item.location}
                  onChange={(e) => updateMeetup(item.id, { location: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateMeetup(item.id, { description: e.target.value })}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Label className="mb-0">File Link</Label>
                  <PreviewLink href={item.fileLink} />
                </div>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={item.fileLink}
                  onChange={(e) => updateMeetup(item.id, { fileLink: e.target.value })}
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  rows={2}
                  placeholder="Notes"
                  value={item.notes}
                  onChange={(e) => updateMeetup(item.id, { notes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addMeetup}>
          <Plus className="w-4 h-4 mr-2" />
          Add Meet-up
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
