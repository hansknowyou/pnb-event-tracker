'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TipTapEditor from '@/components/TipTapEditor';
import { useAuth } from '@/contexts/AuthContext';
import type { KnowledgeBaseItem } from '@/types/knowledge';
import { useTranslations } from 'next-intl';

export default function EditKnowledgeBasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations('knowledge');
  const [item, setItem] = useState<KnowledgeBaseItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    'saved' | 'saving' | 'unsaved' | 'error'
  >('saved');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [title, description, hasUnsavedChanges]);

  useEffect(() => {
    fetchItem();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (item) {
      const changed =
        title !== item.title ||
        description !== item.description;
      setHasUnsavedChanges(changed);
      if (changed) {
        setSaveStatus('unsaved');
      }
    }
  }, [title, description, item]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/knowledge-base/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data);
        setTitle(data.title);
        setDescription(data.description || '');
      } else {
        router.push('/knowledge-base');
      }
    } catch (error) {
      console.error('Error fetching knowledge base item:', error);
      router.push('/knowledge-base');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setSaveStatus('error');
      return;
    }

    setSaving(true);
    setSaveStatus('saving');

    try {
      const response = await fetch(`/api/knowledge-base/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      const data = await response.json();
      setItem(data);
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Error updating knowledge base item:', err);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/knowledge-base/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      router.push('/knowledge-base');
    } catch (err) {
      console.error('Error deleting knowledge base item:', err);
      alert('Failed to delete item');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Redirect if not admin (use useEffect to avoid SSR issues)
  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/knowledge-base');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render if not admin
  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/knowledge-base')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{t('editItem')}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Save Status */}
          <div className="text-sm">
            {saveStatus === 'saved' && (
              <span className="text-green-600">✓ Saved</span>
            )}
            {saveStatus === 'saving' && (
              <span className="text-blue-600">● Saving...</span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="text-orange-600">● Unsaved changes</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-red-600">✗ Error saving</span>
            )}
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

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
              onBlur={handleSave}
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

          {/* Manual Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving || !hasUnsavedChanges}>
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteConfirm')}</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The knowledge base item will be marked
              as deleted and removed from all production links.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
