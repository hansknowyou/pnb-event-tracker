'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function ProfilePage() {
  const { user, refreshUser, updateLanguagePreference } = useAuth();
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setLanguage(user.languagePreference);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          languagePreference: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      updateLanguagePreference(language);
      await refreshUser();
      setMessage(t('profileUpdated'));
    } catch (err: any) {
      setError(err.message || t('updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    setMessage('');
    setError('');

    if (!currentPassword || !newPassword) {
      setError(t('allFieldsRequired'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('passwordsNoMatch'));
      return;
    }

    if (newPassword.length < 4) {
      setError(t('passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      // First verify current password by attempting login
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          password: currentPassword,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error(t('currentPasswordIncorrect'));
      }

      // Update password
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        throw new Error(t('passwordChangeFailed'));
      }

      setMessage(t('passwordChanged'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || t('passwordChangeFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingOverlay isLoading={true} message={tCommon('loading')} />;
  }

  return (
    <>
      <LoadingOverlay isLoading={loading} message="Saving..." />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Account Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('accountInfo')}</CardTitle>
          <CardDescription>{t('accountInfoDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t('username')}</Label>
            <Input value={user.username} disabled className="bg-gray-50" />
          </div>

          <div>
            <Label>{t('role')}</Label>
            <Input
              value={user.isAdmin ? t('administrator') : t('user')}
              disabled
              className="bg-gray-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('profileSettings')}</CardTitle>
          <CardDescription>{t('profileSettingsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="displayName">{t('displayName')}</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t('displayNamePlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="language">{t('languagePreference')}</Label>
            <Select value={language} onValueChange={(val: 'en' | 'zh') => setLanguage(val)}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('english')}</SelectItem>
                <SelectItem value="zh">{t('chinese')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleUpdateProfile} disabled={loading}>
            {loading ? t('saving') : t('saveProfile')}
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>{t('changePassword')}</CardTitle>
          <CardDescription>{t('changePasswordDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <Separator />

          <div>
            <Label htmlFor="newPassword">{t('newPassword')}</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <Button onClick={handleChangePassword} disabled={loading}>
            {loading ? t('changing') : t('changePasswordButton')}
          </Button>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
