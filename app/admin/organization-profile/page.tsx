'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AdminNav from '@/components/AdminNav';
import LoadingOverlay from '@/components/LoadingOverlay';
import LogoUpload from '@/components/LogoUpload';
import type { OrganizationProfile } from '@/types/organizationProfile';

export default function OrganizationProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('organizationProfile');
  const tCommon = useTranslations('common');
  const [profile, setProfile] = useState<OrganizationProfile>({ name: '', logo: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchProfile();
  }, [user, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/organization-profile');
      if (response.ok) {
        const data = await response.json();
        setProfile({ name: data.name || '', logo: data.logo || '' });
      } else {
        const data = await response.json();
        setError(data.error || t('loadFailed'));
      }
    } catch (error) {
      console.error('Error fetching organization profile:', error);
      setError(t('loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/organization-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          logo: profile.logo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('saveFailed'));
      }

      setMessage(t('saved'));
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('saveFailed');
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
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
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? t('saving') : t('save')}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('cardTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="org-name">{t('name')}</Label>
              <Input
                id="org-name"
                placeholder={t('namePlaceholder')}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <LogoUpload
              label={t('logo')}
              helpText={t('logoHelp')}
              value={profile.logo}
              onChange={(value) => setProfile({ ...profile, logo: value })}
              maxDimension={1000}
              maxFileSize={0}
              allowedMimeTypes={['image/png', 'image/jpeg']}
              accept="image/png,image/jpeg"
              messages={{
                invalidType: t('logoInvalidType'),
                fileTooLarge: t('logoFileTooLarge'),
                dimensionTooLarge: t('logoDimensionTooLarge'),
                loadFailed: t('logoLoadFailed'),
                remove: t('logoRemove'),
                empty: t('logoEmpty'),
              }}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
