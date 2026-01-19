'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { KnowledgeBaseItem } from '@/types/knowledge';

interface KnowledgeLinkButtonProps {
  section: string;
  linkedIds: string[];
  onChange: () => void;
}

export default function KnowledgeLinkButton({
  section,
  linkedIds,
  onChange,
}: KnowledgeLinkButtonProps) {
  const t = useTranslations('knowledgeLink');
  const [open, setOpen] = useState(false);
  const [allItems, setAllItems] = useState<KnowledgeBaseItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(linkedIds);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchAllItems();
    }
  }, [open]);

  useEffect(() => {
    setSelectedIds(linkedIds);
  }, [linkedIds]);

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/knowledge-base');
      if (response.ok) {
        const data = await response.json();
        setAllItems(data);
      }
    } catch (error) {
      console.error('Error fetching knowledge items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (itemId: string) => {
    setSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Save to global knowledge links
      await fetch('/api/global-knowledge', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, knowledgeIds: selectedIds }),
      });

      onChange();
      setOpen(false);
    } catch (error) {
      console.error('Error saving knowledge links:', error);
      alert(t('saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <BookOpen className="w-4 h-4 mr-2" />
        {linkedIds.length > 0
          ? `${t('knowledge')} (${linkedIds.length})`
          : t('addKnowledge')}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('manageLinks')}</DialogTitle>
            <DialogDescription>
              {t('manageDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">{t('loading')}</div>
            ) : allItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t('noItems')}
              </div>
            ) : (
              allItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50"
                >
                  <Checkbox
                    id={item._id}
                    checked={selectedIds.includes(item._id)}
                    onCheckedChange={() => handleToggle(item._id)}
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => handleToggle(item._id)}>
                    <Label
                      htmlFor={item._id}
                      className="font-medium cursor-pointer"
                    >
                      {item.title}
                    </Label>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.description.replace(/<[^>]*>/g, '').slice(0, 150)}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t('saving') : t('saveChanges')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
