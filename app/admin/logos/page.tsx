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
import { Plus, Trash2, Edit, Image as ImageIcon, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AdminNav from '@/components/AdminNav';
import LoadingOverlay from '@/components/LoadingOverlay';
import LogoUpload from '@/components/LogoUpload';
import type { AdminLogo } from '@/types/adminLogo';

const downloadBase64 = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
};

export default function AdminLogosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('adminLogos');
  const tCommon = useTranslations('common');
  const [logos, setLogos] = useState<AdminLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingLogo, setEditingLogo] = useState<AdminLogo | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newGoogleLink, setNewGoogleLink] = useState('');
  const [newColorLogoVertical, setNewColorLogoVertical] = useState('');
  const [newWhiteLogoVertical, setNewWhiteLogoVertical] = useState('');
  const [newColorLogoHorizontal, setNewColorLogoHorizontal] = useState('');
  const [newWhiteLogoHorizontal, setNewWhiteLogoHorizontal] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchLogos();
  }, [user, router]);

  const fetchLogos = async () => {
    try {
      const response = await fetch('/api/admin-logos');
      if (response.ok) {
        const data = await response.json();
        setLogos(data);
      }
    } catch (error) {
      console.error('Error fetching logos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setError('');
    setMessage('');

    if (!newTitle.trim()) {
      setError(t('titleRequired'));
      return;
    }
    if (!newGoogleLink.trim()) {
      setError(t('googleLinkRequired'));
      return;
    }

    try {
      const response = await fetch('/api/admin-logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          googleFolderLink: newGoogleLink,
          colorLogoVertical: newColorLogoVertical,
          whiteLogoVertical: newWhiteLogoVertical,
          colorLogoHorizontal: newColorLogoHorizontal,
          whiteLogoHorizontal: newWhiteLogoHorizontal,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('createFailed'));
      }

      setMessage(t('created'));
      setNewTitle('');
      setNewGoogleLink('');
      setNewColorLogoVertical('');
      setNewWhiteLogoVertical('');
      setNewColorLogoHorizontal('');
      setNewWhiteLogoHorizontal('');
      setShowCreateDialog(false);
      fetchLogos();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('createFailed');
      setError(errorMessage);
    }
  };

  const handleEdit = async () => {
    if (!editingLogo) return;
    setError('');
    setMessage('');

    if (!editingLogo.title.trim()) {
      setError(t('titleRequired'));
      return;
    }
    if (!editingLogo.googleFolderLink.trim()) {
      setError(t('googleLinkRequired'));
      return;
    }

    try {
      const response = await fetch(`/api/admin-logos/${editingLogo._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingLogo.title,
          googleFolderLink: editingLogo.googleFolderLink,
          colorLogoVertical: editingLogo.colorLogoVertical,
          whiteLogoVertical: editingLogo.whiteLogoVertical,
          colorLogoHorizontal: editingLogo.colorLogoHorizontal,
          whiteLogoHorizontal: editingLogo.whiteLogoHorizontal,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('updateFailed'));
      }

      setMessage(t('updated'));
      setShowEditDialog(false);
      setEditingLogo(null);
      fetchLogos();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('updateFailed');
      setError(errorMessage);
    }
  };

  const handleDelete = async (logoId: string) => {
    if (!confirm(t('deleteConfirm'))) {
      return;
    }

    try {
      const response = await fetch(`/api/admin-logos/${logoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(t('deleted'));
        fetchLogos();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || t('deleteFailed'));
      }
    } catch (error) {
      console.error('Error deleting logo:', error);
      setError(t('deleteFailed'));
    }
  };

  const openEditDialog = (logo: AdminLogo) => {
    setEditingLogo({ ...logo });
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
                {t('addLogo')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('createLogo')}</DialogTitle>
                <DialogDescription>{t('createLogoDesc')}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="new-title">
                    {t('title')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="new-title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t('titlePlaceholder')}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="new-googleLink" className="mb-0">
                      {t('googleFolderLink')} <span className="text-red-500">*</span>
                    </Label>
                    {newGoogleLink.trim() && (
                      <a
                        href={newGoogleLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Preview
                      </a>
                    )}
                  </div>
                  <Input
                    id="new-googleLink"
                    value={newGoogleLink}
                    onChange={(e) => setNewGoogleLink(e.target.value)}
                    placeholder={t('googleFolderPlaceholder')}
                  />
                </div>

                <LogoUpload
                  label={t('colorLogoVertical')}
                  helpText={t('logoHelp')}
                  value={newColorLogoVertical}
                  onChange={setNewColorLogoVertical}
                  minWidth={500}
                  maxWidth={2000}
                  maxFileSize={0}
                  allowedMimeTypes={['image/png']}
                  accept="image/png"
                  messages={{
                    invalidType: t('logoInvalidType'),
                    fileTooLarge: t('logoFileTooLarge'),
                    dimensionTooLarge: t('logoDimensionWidthRange'),
                    loadFailed: t('logoLoadFailed'),
                    remove: t('logoRemove'),
                    empty: t('logoEmpty'),
                  }}
                />
                    {newColorLogoVertical && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => downloadBase64(newColorLogoVertical, 'color-logo-vertical.png')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t('downloadColorVertical')}
                      </Button>
                    )}

                <LogoUpload
                  label={t('whiteLogoVertical')}
                  helpText={t('logoHelp')}
                  value={newWhiteLogoVertical}
                  onChange={setNewWhiteLogoVertical}
                  minWidth={500}
                  maxWidth={2000}
                  maxFileSize={0}
                  allowedMimeTypes={['image/png']}
                  accept="image/png"
                  messages={{
                    invalidType: t('logoInvalidType'),
                    fileTooLarge: t('logoFileTooLarge'),
                    dimensionTooLarge: t('logoDimensionWidthRange'),
                    loadFailed: t('logoLoadFailed'),
                    remove: t('logoRemove'),
                    empty: t('logoEmpty'),
                  }}
                />
                {newWhiteLogoVertical && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => downloadBase64(newWhiteLogoVertical, 'white-logo-vertical.png')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('downloadWhiteVertical')}
                  </Button>
                )}

                <LogoUpload
                  label={t('colorLogoHorizontal')}
                  helpText={t('logoHelp')}
                  value={newColorLogoHorizontal}
                  onChange={setNewColorLogoHorizontal}
                  minWidth={500}
                  maxWidth={2000}
                  maxFileSize={0}
                  allowedMimeTypes={['image/png']}
                  accept="image/png"
                  messages={{
                    invalidType: t('logoInvalidType'),
                    fileTooLarge: t('logoFileTooLarge'),
                    dimensionTooLarge: t('logoDimensionWidthRange'),
                    loadFailed: t('logoLoadFailed'),
                    remove: t('logoRemove'),
                    empty: t('logoEmpty'),
                  }}
                />
                {newColorLogoHorizontal && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => downloadBase64(newColorLogoHorizontal, 'color-logo-horizontal.png')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('downloadColorHorizontal')}
                  </Button>
                )}

                <LogoUpload
                  label={t('whiteLogoHorizontal')}
                  helpText={t('logoHelp')}
                  value={newWhiteLogoHorizontal}
                  onChange={setNewWhiteLogoHorizontal}
                  minWidth={500}
                  maxWidth={2000}
                  maxFileSize={0}
                  allowedMimeTypes={['image/png']}
                  accept="image/png"
                  messages={{
                    invalidType: t('logoInvalidType'),
                    fileTooLarge: t('logoFileTooLarge'),
                    dimensionTooLarge: t('logoDimensionWidthRange'),
                    loadFailed: t('logoLoadFailed'),
                    remove: t('logoRemove'),
                    empty: t('logoEmpty'),
                  }}
                />
                {newWhiteLogoHorizontal && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => downloadBase64(newWhiteLogoHorizontal, 'white-logo-horizontal.png')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('downloadWhiteHorizontal')}
                  </Button>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  {tCommon('cancel')}
                </Button>
                <Button onClick={handleCreate}>{t('addLogo')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {logos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{t('noLogos')}</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                {t('logoList')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {logos.map((logo) => (
                  <div
                    key={logo._id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg gap-3"
                  >
                    <div className="flex gap-2">
                      {logo.colorLogoVertical && (
                        <img
                          src={logo.colorLogoVertical}
                          alt={t('colorLogoVertical')}
                          className="h-10 w-10 rounded border border-gray-200 object-contain bg-white"
                        />
                      )}
                      {logo.whiteLogoVertical && (
                        <img
                          src={logo.whiteLogoVertical}
                          alt={t('whiteLogoVertical')}
                          className="h-10 w-10 rounded border border-gray-200 object-contain bg-white"
                        />
                      )}
                      {logo.colorLogoHorizontal && (
                        <img
                          src={logo.colorLogoHorizontal}
                          alt={t('colorLogoHorizontal')}
                          className="h-10 w-10 rounded border border-gray-200 object-contain bg-white"
                        />
                      )}
                      {logo.whiteLogoHorizontal && (
                        <img
                          src={logo.whiteLogoHorizontal}
                          alt={t('whiteLogoHorizontal')}
                          className="h-10 w-10 rounded border border-gray-200 object-contain bg-white"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {logo.title || t('untitled')}
                      </div>
                      <div className="text-xs text-blue-600 truncate">
                        {logo.googleFolderLink}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {logo.colorLogoVertical && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => downloadBase64(logo.colorLogoVertical, 'color-logo-vertical.png')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {t('downloadColorVertical')}
                          </Button>
                        )}
                        {logo.whiteLogoVertical && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => downloadBase64(logo.whiteLogoVertical, 'white-logo-vertical.png')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {t('downloadWhiteVertical')}
                          </Button>
                        )}
                        {logo.colorLogoHorizontal && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => downloadBase64(logo.colorLogoHorizontal, 'color-logo-horizontal.png')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {t('downloadColorHorizontal')}
                          </Button>
                        )}
                        {logo.whiteLogoHorizontal && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => downloadBase64(logo.whiteLogoHorizontal, 'white-logo-horizontal.png')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {t('downloadWhiteHorizontal')}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(logo)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(logo._id)}
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
              <DialogTitle>{t('editLogo')}</DialogTitle>
              <DialogDescription>{t('editLogoDesc')}</DialogDescription>
            </DialogHeader>

            {editingLogo && (
              <div className="space-y-4 py-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="edit-title">
                    {t('title')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-title"
                    value={editingLogo.title}
                    onChange={(e) =>
                      setEditingLogo({ ...editingLogo, title: e.target.value })
                    }
                    placeholder={t('titlePlaceholder')}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="edit-googleLink" className="mb-0">
                      {t('googleFolderLink')} <span className="text-red-500">*</span>
                    </Label>
                    {editingLogo.googleFolderLink?.trim() && (
                      <a
                        href={editingLogo.googleFolderLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Preview
                      </a>
                    )}
                  </div>
                  <Input
                    id="edit-googleLink"
                    value={editingLogo.googleFolderLink}
                    onChange={(e) =>
                      setEditingLogo({ ...editingLogo, googleFolderLink: e.target.value })
                    }
                    placeholder={t('googleFolderPlaceholder')}
                  />
                </div>

                <LogoUpload
                  label={t('colorLogoVertical')}
                  helpText={t('logoHelp')}
                  value={editingLogo.colorLogoVertical || ''}
                  onChange={(value) =>
                    setEditingLogo({ ...editingLogo, colorLogoVertical: value })
                  }
                  minWidth={500}
                  maxWidth={2000}
                  maxFileSize={0}
                  allowedMimeTypes={['image/png']}
                  accept="image/png"
                  messages={{
                    invalidType: t('logoInvalidType'),
                    fileTooLarge: t('logoFileTooLarge'),
                    dimensionTooLarge: t('logoDimensionWidthRange'),
                    loadFailed: t('logoLoadFailed'),
                    remove: t('logoRemove'),
                    empty: t('logoEmpty'),
                  }}
                />
                {editingLogo.colorLogoVertical && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => downloadBase64(editingLogo.colorLogoVertical, 'color-logo-vertical.png')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('downloadColorVertical')}
                  </Button>
                )}

                <LogoUpload
                  label={t('whiteLogoVertical')}
                  helpText={t('logoHelp')}
                  value={editingLogo.whiteLogoVertical || ''}
                  onChange={(value) =>
                    setEditingLogo({ ...editingLogo, whiteLogoVertical: value })
                  }
                  minWidth={500}
                  maxWidth={2000}
                  maxFileSize={0}
                  allowedMimeTypes={['image/png']}
                  accept="image/png"
                  messages={{
                    invalidType: t('logoInvalidType'),
                    fileTooLarge: t('logoFileTooLarge'),
                    dimensionTooLarge: t('logoDimensionWidthRange'),
                    loadFailed: t('logoLoadFailed'),
                    remove: t('logoRemove'),
                    empty: t('logoEmpty'),
                  }}
                />
                {editingLogo.whiteLogoVertical && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => downloadBase64(editingLogo.whiteLogoVertical, 'white-logo-vertical.png')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('downloadWhiteVertical')}
                  </Button>
                )}

                <LogoUpload
                  label={t('colorLogoHorizontal')}
                  helpText={t('logoHelp')}
                  value={editingLogo.colorLogoHorizontal || ''}
                  onChange={(value) =>
                    setEditingLogo({ ...editingLogo, colorLogoHorizontal: value })
                  }
                  minWidth={500}
                  maxWidth={2000}
                  maxFileSize={0}
                  allowedMimeTypes={['image/png']}
                  accept="image/png"
                  messages={{
                    invalidType: t('logoInvalidType'),
                    fileTooLarge: t('logoFileTooLarge'),
                    dimensionTooLarge: t('logoDimensionWidthRange'),
                    loadFailed: t('logoLoadFailed'),
                    remove: t('logoRemove'),
                    empty: t('logoEmpty'),
                  }}
                />
                {editingLogo.colorLogoHorizontal && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => downloadBase64(editingLogo.colorLogoHorizontal, 'color-logo-horizontal.png')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('downloadColorHorizontal')}
                  </Button>
                )}

                <LogoUpload
                  label={t('whiteLogoHorizontal')}
                  helpText={t('logoHelp')}
                  value={editingLogo.whiteLogoHorizontal || ''}
                  onChange={(value) =>
                    setEditingLogo({ ...editingLogo, whiteLogoHorizontal: value })
                  }
                  minWidth={500}
                  maxWidth={2000}
                  maxFileSize={0}
                  allowedMimeTypes={['image/png']}
                  accept="image/png"
                  messages={{
                    invalidType: t('logoInvalidType'),
                    fileTooLarge: t('logoFileTooLarge'),
                    dimensionTooLarge: t('logoDimensionWidthRange'),
                    loadFailed: t('logoLoadFailed'),
                    remove: t('logoRemove'),
                    empty: t('logoEmpty'),
                  }}
                />
                {editingLogo.whiteLogoHorizontal && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => downloadBase64(editingLogo.whiteLogoHorizontal, 'white-logo-horizontal.png')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('downloadWhiteHorizontal')}
                  </Button>
                )}
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
