'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Ticket } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AdminNav from '@/components/AdminNav';
import LoadingOverlay from '@/components/LoadingOverlay';
import LogoUpload from '@/components/LogoUpload';
import type { TicketingPlatform } from '@/types/ticketingPlatform';

export default function TicketingPlatformManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('ticketingPlatforms');
  const tCommon = useTranslations('common');
  const [platforms, setPlatforms] = useState<TicketingPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<TicketingPlatform | null>(null);
  const [newName, setNewName] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLogo, setNewLogo] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchPlatforms();
  }, [user, router]);

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/ticketing-platforms');
      if (response.ok) {
        const data = await response.json();
        setPlatforms(data);
      }
    } catch (error) {
      console.error('Error fetching ticketing platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setError('');
    setMessage('');

    if (!newName.trim()) {
      setError(t('nameRequired'));
      return;
    }

    try {
      const response = await fetch('/api/ticketing-platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          logo: newLogo,
          link: newLink,
          description: newDescription,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('createFailed'));
      }

      setMessage(t('created'));
      setNewName('');
      setNewLogo('');
      setNewLink('');
      setNewDescription('');
      setShowCreateDialog(false);
      fetchPlatforms();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('createFailed');
      setError(errorMessage);
    }
  };

  const handleEdit = async () => {
    if (!editingPlatform) return;
    setError('');
    setMessage('');

    if (!editingPlatform.name.trim()) {
      setError(t('nameRequired'));
      return;
    }

    try {
      const response = await fetch(`/api/ticketing-platforms/${editingPlatform._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingPlatform.name,
          logo: editingPlatform.logo,
          link: editingPlatform.link,
          description: editingPlatform.description,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('updateFailed'));
      }

      setMessage(t('updated'));
      setShowEditDialog(false);
      setEditingPlatform(null);
      fetchPlatforms();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('updateFailed');
      setError(errorMessage);
    }
  };

  const handleDelete = async (platformId: string, platformName: string) => {
    if (!confirm(`${t('deleteConfirm')} "${platformName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/ticketing-platforms/${platformId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(t('deleted'));
        fetchPlatforms();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || t('deleteFailed'));
      }
    } catch (error) {
      console.error('Error deleting ticketing platform:', error);
      setError(t('deleteFailed'));
    }
  };

  const openEditDialog = (platform: TicketingPlatform) => {
    setEditingPlatform({ ...platform });
    setShowEditDialog(true);
    setError('');
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <>
      <LoadingOverlay isLoading={loading} message={tCommon('loading')} />
      <div className="container mx-auto px-4 py-8">
        <AdminNav />
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-gray-600 mt-2">{t('description')}</p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('addPlatform')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('createPlatform')}</DialogTitle>
                <DialogDescription>{t('createPlatformDesc')}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <LogoUpload
                  label={t('logo')}
                  helpText={t('logoHelp')}
                  value={newLogo}
                  onChange={setNewLogo}
                  messages={{
                    invalidType: t('logoInvalidType'),
                    fileTooLarge: t('logoFileTooLarge'),
                    dimensionTooLarge: t('logoDimensionTooLarge'),
                    loadFailed: t('logoLoadFailed'),
                    remove: t('logoRemove'),
                    empty: t('logoEmpty'),
                  }}
                />

                <div>
                  <Label htmlFor="new-platformName">
                    {t('name')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="new-platformName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={t('namePlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="new-platformLink">{t('link')}</Label>
                  <Input
                    id="new-platformLink"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder={t('linkPlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="new-platformDescription">{t('descriptionLabel')}</Label>
                  <Textarea
                    id="new-platformDescription"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder={t('descriptionPlaceholder')}
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  {tCommon('cancel')}
                </Button>
                <Button onClick={handleCreate}>{t('addPlatform')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {platforms.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{t('noPlatforms')}</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                {t('platformList')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {platforms.map((platform) => (
                  <div
                    key={platform._id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg gap-3"
                  >
                    {platform.logo && (
                      <img
                        src={platform.logo}
                        alt={platform.name}
                        className="h-10 w-10 rounded border border-gray-200 object-contain bg-white"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{platform.name}</div>
                      {platform.link && (
                        <div className="text-xs text-blue-600 truncate">{platform.link}</div>
                      )}
                      {platform.description && (
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {platform.description}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(platform)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(platform._id, platform.name)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('editPlatform')}</DialogTitle>
              <DialogDescription>{t('editPlatformDesc')}</DialogDescription>
            </DialogHeader>

            {editingPlatform && (
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <LogoUpload
                  label={t('logo')}
                  helpText={t('logoHelp')}
                  value={editingPlatform.logo || ''}
                  onChange={(value) =>
                    setEditingPlatform({ ...editingPlatform, logo: value })
                  }
                  messages={{
                    invalidType: t('logoInvalidType'),
                    fileTooLarge: t('logoFileTooLarge'),
                    dimensionTooLarge: t('logoDimensionTooLarge'),
                    loadFailed: t('logoLoadFailed'),
                    remove: t('logoRemove'),
                    empty: t('logoEmpty'),
                  }}
                />

                <div>
                  <Label htmlFor="edit-platformName">
                    {t('name')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-platformName"
                    value={editingPlatform.name}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, name: e.target.value })
                    }
                    placeholder={t('namePlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-platformLink">{t('link')}</Label>
                  <Input
                    id="edit-platformLink"
                    value={editingPlatform.link || ''}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, link: e.target.value })
                    }
                    placeholder={t('linkPlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-platformDescription">{t('descriptionLabel')}</Label>
                  <Textarea
                    id="edit-platformDescription"
                    value={editingPlatform.description || ''}
                    onChange={(e) =>
                      setEditingPlatform({ ...editingPlatform, description: e.target.value })
                    }
                    placeholder={t('descriptionPlaceholder')}
                    rows={4}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                {tCommon('cancel')}
              </Button>
              <Button onClick={handleEdit}>{tCommon('save')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
