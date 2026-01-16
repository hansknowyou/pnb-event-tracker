'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import TipTapEditor from '@/components/TipTapEditor';
import TagInput from '@/components/TagInput';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';

export default function NewKnowledgeBasePage() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations('knowledge');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not admin (use useEffect to avoid SSR issues)
  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/knowledge-base');
    }
  }, [user, router]);

  // Fetch all existing tags
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/knowledge-base');
      if (response.ok) {
        const items = await response.json();
        // Extract all unique tags
        const allTags = new Set<string>();
        items.forEach((item: any) => {
          if (item.tags) {
            item.tags.forEach((tag: string) => allTags.add(tag));
          }
        });
        setAvailableTags(Array.from(allTags).sort());
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Don't render if not admin
  if (!user || !user.isAdmin) {
    return null;
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description,
          tags,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create knowledge base item');
      }

      const data = await response.json();

      // Refetch tags to update available tags list
      await fetchTags();

      router.push(`/knowledge-base/${data._id}`);
    } catch (err) {
      console.error('Error creating knowledge base item:', err);
      setError(err instanceof Error ? err.message : 'Failed to create item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/knowledge-base')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create Knowledge Base Item</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter a clear, descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/200 characters
            </p>
          </div>

          {/* Description with inline image support */}
          <div>
            <Label>Description</Label>
            <p className="text-xs text-gray-500 mb-2">
              Use the image button (📷) in the toolbar to insert images inline
            </p>
            <TipTapEditor
              value={description}
              onChange={setDescription}
              placeholder="Add detailed information, instructions, or resources..."
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <p className="text-xs text-gray-500 mb-2">
              Add tags to categorize and make this item easier to find
            </p>
            <TagInput
              tags={tags}
              onChange={setTags}
              placeholder="Type to search or create tags..."
              availableTags={availableTags}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/knowledge-base')}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !title.trim()}>
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Item
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
