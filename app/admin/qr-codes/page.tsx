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
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, QrCode, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AdminNav from '@/components/AdminNav';
import LoadingOverlay from '@/components/LoadingOverlay';
import LogoUpload from '@/components/LogoUpload';
import type { QRCodeItem } from '@/types/qrCode';

const QR_IMAGE_HELP = 'Upload a PNG or JPG QR code image.';

export default function QRCodeManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('qrCodes');
  const tCommon = useTranslations('common');
  const [items, setItems] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<QRCodeItem | null>(null);
  const [newItem, setNewItem] = useState<QRCodeItem>({
    title: '',
    description: '',
    image: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchItems();
  }, [user, router]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/qr-codes');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setError('');
    setMessage('');

    if (!newItem.title.trim()) {
      setError(t('titleRequired'));
      return;
    }

    try {
      const response = await fetch('/api/qr-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('createFailed'));
      }

      setMessage(t('created'));
      setNewItem({ title: '', description: '', image: '' });
      setShowCreateDialog(false);
      fetchItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('createFailed');
      setError(errorMessage);
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;
    setError('');
    setMessage('');

    if (!editingItem.title.trim()) {
      setError(t('titleRequired'));
      return;
    }

    try {
      const response = await fetch(`/api/qr-codes/${editingItem._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('updateFailed'));
      }

      setMessage(t('updated'));
      setShowEditDialog(false);
      setEditingItem(null);
      fetchItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('updateFailed');
      setError(errorMessage);
    }
  };

  const handleDelete = async (itemId: string, itemTitle: string) => {
    if (!confirm(`${t('deleteConfirm')} "${itemTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/qr-codes/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(t('deleted'));
        fetchItems();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || t('deleteFailed'));
      }
    } catch (error) {
      console.error('Error deleting QR code:', error);
      setError(t('deleteFailed'));
    }
  };

  const openEditDialog = (item: QRCodeItem) => {
    setEditingItem({ ...item });
    setShowEditDialog(true);
    setError('');
  };

  const renderDownloadLink = (title: string, image: string) => {
    if (!image) return null;
    return (
      <a
        href={image}
        download={`${title || 'qr-code'}.png`}
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
      >
        <Download className="w-4 h-4" />
        {t('download')}
      </a>
    );
  };

  const renderForm = (
    value: QRCodeItem,
    onChange: (next: QRCodeItem) => void
  ) => (
    <div className="space-y-4 py-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <Label>{t('titleLabel')}</Label>
        <Input
          placeholder={t('titlePlaceholder')}
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>

      <div>
        <Label>{t('descriptionLabel')}</Label>
        <Textarea
          placeholder={t('descriptionPlaceholder')}
          rows={2}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
      </div>

      <LogoUpload
        label={t('image')}
        helpText={QR_IMAGE_HELP}
        value={value.image}
        onChange={(image) => onChange({ ...value, image })}
        messages={{
          invalidType: t('imageInvalidType'),
          fileTooLarge: t('imageFileTooLarge'),
          dimensionTooLarge: t('imageDimensionTooLarge'),
          loadFailed: t('imageLoadFailed'),
          remove: t('removeImage'),
          empty: t('imageEmpty'),
        }}
        maxDimension={2000}
        maxFileSize={2 * 1024 * 1024}
      />
    </div>
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
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-gray-600 mt-2">{t('descriptionText')}</p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('create')}</DialogTitle>
                <DialogDescription>{t('createDesc')}</DialogDescription>
              </DialogHeader>
              {renderForm(newItem, setNewItem)}
              <div className="flex justify-end">
                <Button onClick={handleCreate}>{t('create')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
            {message}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('listTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-gray-500">{t('empty')}</div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item._id} className="flex items-start justify-between gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-gray-400" />
                        <div className="font-semibold">{item.title}</div>
                      </div>
                      {item.description && (
                        <div className="text-sm text-gray-600">{item.description}</div>
                      )}
                      {renderDownloadLink(item.title, item.image)}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item._id || '', item.title)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('edit')}</DialogTitle>
              <DialogDescription>{t('editDesc')}</DialogDescription>
            </DialogHeader>
            {editingItem && renderForm(editingItem, setEditingItem)}
            <div className="flex justify-end">
              <Button onClick={handleEdit}>{t('save')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
