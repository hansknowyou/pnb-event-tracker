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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Edit, Megaphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AdminNav from '@/components/AdminNav';
import LoadingOverlay from '@/components/LoadingOverlay';
import type { PromotionChannel } from '@/types/promotionChannel';

const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'French', label: 'French' },
];

export default function PromotionChannelManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('promotionChannels');
  const tCommon = useTranslations('common');
  const [channels, setChannels] = useState<PromotionChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingChannel, setEditingChannel] = useState<PromotionChannel | null>(null);
  const [newChannel, setNewChannel] = useState<PromotionChannel>({
    name: '',
    description: '',
    requirements: '',
    isPaidAds: false,
    languages: [],
    notes: '',
    link: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchChannels();
  }, [user, router]);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/promotion-channels');
      if (response.ok) {
        const data = await response.json();
        setChannels(data);
      }
    } catch (error) {
      console.error('Error fetching promotion channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = (channel: PromotionChannel, value: string) => {
    const hasLanguage = channel.languages.includes(value);
    const nextLanguages = hasLanguage
      ? channel.languages.filter((lang) => lang !== value)
      : [...channel.languages, value];
    return { ...channel, languages: nextLanguages };
  };

  const handleCreate = async () => {
    setError('');
    setMessage('');

    if (!newChannel.name.trim()) {
      setError(t('nameRequired'));
      return;
    }

    try {
      const response = await fetch('/api/promotion-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChannel),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('createFailed'));
      }

      setMessage(t('created'));
      setNewChannel({
        name: '',
        description: '',
        requirements: '',
        isPaidAds: false,
        languages: [],
        notes: '',
        link: '',
      });
      setShowCreateDialog(false);
      fetchChannels();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('createFailed');
      setError(errorMessage);
    }
  };

  const handleEdit = async () => {
    if (!editingChannel) return;
    setError('');
    setMessage('');

    if (!editingChannel.name.trim()) {
      setError(t('nameRequired'));
      return;
    }

    try {
      const response = await fetch(`/api/promotion-channels/${editingChannel._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingChannel),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('updateFailed'));
      }

      setMessage(t('updated'));
      setShowEditDialog(false);
      setEditingChannel(null);
      fetchChannels();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('updateFailed');
      setError(errorMessage);
    }
  };

  const handleDelete = async (channelId: string, channelName: string) => {
    if (!confirm(`${t('deleteConfirm')} "${channelName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/promotion-channels/${channelId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(t('deleted'));
        fetchChannels();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || t('deleteFailed'));
      }
    } catch (error) {
      console.error('Error deleting promotion channel:', error);
      setError(t('deleteFailed'));
    }
  };

  const openEditDialog = (channel: PromotionChannel) => {
    setEditingChannel({ ...channel });
    setShowEditDialog(true);
    setError('');
  };

  if (!user?.isAdmin) {
    return null;
  }

  const renderForm = (
    channel: PromotionChannel,
    onChange: (next: PromotionChannel) => void
  ) => (
    <div className="space-y-4 py-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <Label>{t('name')}</Label>
        <Input
          placeholder={t('namePlaceholder')}
          value={channel.name}
          onChange={(e) => onChange({ ...channel, name: e.target.value })}
        />
      </div>

      <div>
        <Label>{t('description')}</Label>
        <Textarea
          placeholder={t('descriptionPlaceholder')}
          rows={2}
          value={channel.description}
          onChange={(e) => onChange({ ...channel, description: e.target.value })}
        />
      </div>

      <div>
        <Label>{t('requirements')}</Label>
        <Textarea
          placeholder={t('requirementsPlaceholder')}
          rows={2}
          value={channel.requirements}
          onChange={(e) => onChange({ ...channel, requirements: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={channel.isPaidAds}
          onCheckedChange={(checked) => onChange({ ...channel, isPaidAds: Boolean(checked) })}
        />
        <Label className="cursor-pointer">{t('isPaidAds')}</Label>
      </div>

      <div>
        <Label>{t('languages')}</Label>
        <div className="flex flex-wrap gap-3 mt-2">
          {LANGUAGE_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={channel.languages.includes(option.value)}
                onCheckedChange={() => onChange(toggleLanguage(channel, option.value))}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>{t('notes')}</Label>
        <Textarea
          placeholder={t('notesPlaceholder')}
          rows={2}
          value={channel.notes}
          onChange={(e) => onChange({ ...channel, notes: e.target.value })}
        />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Label className="mb-0">{t('link')}</Label>
        </div>
        <Input
          type="url"
          placeholder={t('linkPlaceholder')}
          value={channel.link}
          onChange={(e) => onChange({ ...channel, link: e.target.value })}
        />
      </div>
    </div>
  );

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
                {t('addChannel')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('createChannel')}</DialogTitle>
                <DialogDescription>{t('createChannelDesc')}</DialogDescription>
              </DialogHeader>
              {renderForm(newChannel, setNewChannel)}
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
            {channels.length === 0 ? (
              <div className="text-gray-500">{t('noChannels')}</div>
            ) : (
              <div className="space-y-3">
                {channels.map((channel) => (
                  <div key={channel._id} className="flex items-start justify-between gap-4 p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-gray-400" />
                        <div className="font-semibold">{channel.name}</div>
                      </div>
                      {channel.description && (
                        <div className="text-sm text-gray-600">{channel.description}</div>
                      )}
                      {channel.link && (
                        <div className="text-sm text-blue-600">{channel.link}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(channel)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(channel._id || '', channel.name)}
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
              <DialogTitle>{t('editChannel')}</DialogTitle>
              <DialogDescription>{t('editChannelDesc')}</DialogDescription>
            </DialogHeader>
            {editingChannel && renderForm(editingChannel, setEditingChannel)}
            <div className="flex justify-end">
              <Button onClick={handleEdit}>{t('save')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
