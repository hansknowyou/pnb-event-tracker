'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
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
import type { KnowledgeBaseItem, KnowledgeSection } from '@/types/knowledge';

interface KnowledgeLinkButtonProps {
  section: KnowledgeSection;
  linkedIds: string[];
  productionId: string;
  onChange: () => void;
}

export default function KnowledgeLinkButton({
  section,
  linkedIds,
  productionId,
  onChange,
}: KnowledgeLinkButtonProps) {
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
      // Find items to add (in selectedIds but not in linkedIds)
      const toAdd = selectedIds.filter((id) => !linkedIds.includes(id));

      // Find items to remove (in linkedIds but not in selectedIds)
      const toRemove = linkedIds.filter((id) => !selectedIds.includes(id));

      // Add new links
      for (const itemId of toAdd) {
        await fetch(`/api/productions/${productionId}/knowledge-links`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section, knowledgeItemId: itemId }),
        });
      }

      // Remove old links
      for (const itemId of toRemove) {
        await fetch(
          `/api/productions/${productionId}/knowledge-links?section=${section}&knowledgeItemId=${itemId}`,
          { method: 'DELETE' }
        );
      }

      onChange();
      setOpen(false);
    } catch (error) {
      console.error('Error saving knowledge links:', error);
      alert('Failed to save knowledge links');
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
          ? `Knowledge (${linkedIds.length})`
          : 'Add Knowledge'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Knowledge Links</DialogTitle>
            <DialogDescription>
              Select knowledge base items to link to this section. Linked items
              will be easily accessible for reference.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : allItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No knowledge base items available. Create one first.
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
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
