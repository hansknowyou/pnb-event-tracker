'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AdminNav from '@/components/AdminNav';
import LoadingOverlay from '@/components/LoadingOverlay';
import type { MediaPackage, MediaType } from '@/types/mediaPackage';

const languageOptions = ['English', 'Chinese', 'French'];

const createEmptyMediaType = (): MediaType => ({
  id: Date.now().toString(),
  title: '',
  description: '',
  width: '',
  height: '',
  requirements: '',
  printRequired: false,
  languages: [],
  notes: '',
  isVideo: false,
  videoLength: '',
  videoRatio: '',
});

export default function MediaPackagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('mediaPackages');
  const tCommon = useTranslations('common');
  const [packages, setPackages] = useState<MediaPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<MediaPackage | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newMediaTypes, setNewMediaTypes] = useState<MediaType[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchPackages();
  }, [user, router]);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/media-packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      }
    } catch (error) {
      console.error('Error fetching media packages:', error);
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
      const response = await fetch('/api/media-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          mediaTypes: newMediaTypes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('createFailed'));
      }

      setMessage(t('created'));
      setNewName('');
      setNewDescription('');
      setNewMediaTypes([]);
      setShowCreateDialog(false);
      fetchPackages();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('createFailed');
      setError(errorMessage);
    }
  };

  const handleEdit = async () => {
    if (!editingPackage) return;
    setError('');
    setMessage('');

    if (!editingPackage.name.trim()) {
      setError(t('nameRequired'));
      return;
    }

    try {
      const response = await fetch(`/api/media-packages/${editingPackage._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingPackage.name,
          description: editingPackage.description,
          mediaTypes: editingPackage.mediaTypes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('updateFailed'));
      }

      setMessage(t('updated'));
      setShowEditDialog(false);
      setEditingPackage(null);
      fetchPackages();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('updateFailed');
      setError(errorMessage);
    }
  };

  const handleDelete = async (packageId: string) => {
    if (!confirm(t('deleteConfirm'))) {
      return;
    }

    try {
      const response = await fetch(`/api/media-packages/${packageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(t('deleted'));
        fetchPackages();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || t('deleteFailed'));
      }
    } catch (error) {
      console.error('Error deleting media package:', error);
      setError(t('deleteFailed'));
    }
  };

  const openEditDialog = (pkg: MediaPackage) => {
    setEditingPackage({ ...pkg, description: pkg.description || '', mediaTypes: pkg.mediaTypes || [] });
    setShowEditDialog(true);
    setError('');
  };

  const updateMediaType = (
    mediaTypes: MediaType[],
    id: string,
    updates: Partial<MediaType>
  ) => mediaTypes.map((mediaType) => (mediaType.id === id ? { ...mediaType, ...updates } : mediaType));

  const toggleMediaLanguage = (mediaType: MediaType, language: string) => {
    const hasLanguage = mediaType.languages.includes(language);
    return hasLanguage
      ? mediaType.languages.filter((l) => l !== language)
      : [...mediaType.languages, language];
  };

  const renderMediaTypeForm = (
    mediaType: MediaType,
    onChange: (updates: Partial<MediaType>) => void,
    onRemove: () => void
  ) => (
    <Card key={mediaType.id}>
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle>{t('mediaType')}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>{t('title')}</Label>
          <Input
            value={mediaType.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder={t('titlePlaceholder')}
          />
        </div>

        <div>
          <Label>{t('description')}</Label>
          <Textarea
            value={mediaType.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={2}
            placeholder={t('descriptionPlaceholder')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t('width')}</Label>
            <Input
              value={mediaType.width}
              onChange={(e) => onChange({ width: e.target.value })}
              placeholder={t('widthPlaceholder')}
            />
          </div>
          <div>
            <Label>{t('height')}</Label>
            <Input
              value={mediaType.height}
              onChange={(e) => onChange({ height: e.target.value })}
              placeholder={t('heightPlaceholder')}
            />
          </div>
        </div>

        <div>
          <Label>{t('requirements')}</Label>
          <Textarea
            value={mediaType.requirements}
            onChange={(e) => onChange({ requirements: e.target.value })}
            rows={2}
            placeholder={t('requirementsPlaceholder')}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id={`print-required-${mediaType.id}`}
            checked={mediaType.printRequired}
            onCheckedChange={(checked) => onChange({ printRequired: checked as boolean })}
          />
          <Label htmlFor={`print-required-${mediaType.id}`} className="mb-0">
            {t('printRequired')}
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id={`is-video-${mediaType.id}`}
            checked={mediaType.isVideo}
            onCheckedChange={(checked) => onChange({ isVideo: checked as boolean })}
          />
          <Label htmlFor={`is-video-${mediaType.id}`} className="mb-0">
            {t('isVideo')}
          </Label>
        </div>

        {mediaType.isVideo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('videoLength')}</Label>
              <Input
                value={mediaType.videoLength}
                onChange={(e) => onChange({ videoLength: e.target.value })}
                placeholder={t('videoLengthPlaceholder')}
              />
            </div>
            <div>
              <Label>{t('videoRatio')}</Label>
              <Input
                value={mediaType.videoRatio}
                onChange={(e) => onChange({ videoRatio: e.target.value })}
                placeholder={t('videoRatioPlaceholder')}
              />
            </div>
          </div>
        )}

        <div>
          <Label>{t('languages')}</Label>
          <div className="flex flex-wrap gap-4 mt-2">
            {languageOptions.map((lang) => (
              <div key={lang} className="flex items-center gap-2">
                <Checkbox
                  id={`${mediaType.id}-${lang}`}
                  checked={mediaType.languages.includes(lang)}
                  onCheckedChange={() =>
                    onChange({ languages: toggleMediaLanguage(mediaType, lang) })
                  }
                />
                <Label htmlFor={`${mediaType.id}-${lang}`} className="mb-0">
                  {lang}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>{t('notes')}</Label>
          <Textarea
            value={mediaType.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            rows={2}
            placeholder={t('notesPlaceholder')}
          />
        </div>
      </CardContent>
    </Card>
  );

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
            <h1 className="text-3xl font-bold">{t('pageTitle')}</h1>
            <p className="text-gray-600 mt-2">{t('pageDescription')}</p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('addPackage')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('createPackage')}</DialogTitle>
                <DialogDescription>{t('createPackageDesc')}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="new-name">
                    {t('packageName')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="new-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={t('packageNamePlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="new-description">{t('packageDescription')}</Label>
                  <Textarea
                    id="new-description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                    placeholder={t('packageDescriptionPlaceholder')}
                  />
                </div>

                <div className="space-y-4">
                  {newMediaTypes.map((mediaType) =>
                    renderMediaTypeForm(
                      mediaType,
                      (updates) => setNewMediaTypes(updateMediaType(newMediaTypes, mediaType.id, updates)),
                      () => setNewMediaTypes(newMediaTypes.filter((m) => m.id !== mediaType.id))
                    )
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewMediaTypes([...newMediaTypes, createEmptyMediaType()])}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('addMediaType')}
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  {tCommon('cancel')}
                </Button>
                <Button onClick={handleCreate}>{t('addPackage')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {packages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{t('noPackages')}</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t('packageList')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg gap-3"
                  >
                    <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {pkg.name}
                    </div>
                    {pkg.description && (
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {pkg.description}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      {t('mediaTypeCount', { count: pkg.mediaTypes?.length || 0 })}
                    </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(pkg)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(pkg._id!)}>
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
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('editPackage')}</DialogTitle>
              <DialogDescription>{t('editPackageDesc')}</DialogDescription>
            </DialogHeader>

            {editingPackage && (
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="edit-name">
                    {t('packageName')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingPackage.name}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, name: e.target.value })
                    }
                    placeholder={t('packageNamePlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-description">{t('packageDescription')}</Label>
                  <Textarea
                    id="edit-description"
                    value={editingPackage.description}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, description: e.target.value })
                    }
                    rows={2}
                    placeholder={t('packageDescriptionPlaceholder')}
                  />
                </div>

                <div className="space-y-4">
                  {editingPackage.mediaTypes.map((mediaType) =>
                    renderMediaTypeForm(
                      mediaType,
                      (updates) =>
                        setEditingPackage({
                          ...editingPackage,
                          mediaTypes: updateMediaType(editingPackage.mediaTypes, mediaType.id, updates),
                        }),
                      () =>
                        setEditingPackage({
                          ...editingPackage,
                          mediaTypes: editingPackage.mediaTypes.filter((m) => m.id !== mediaType.id),
                        })
                    )
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setEditingPackage({
                        ...editingPackage,
                        mediaTypes: [...editingPackage.mediaTypes, createEmptyMediaType()],
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('addMediaType')}
                  </Button>
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
