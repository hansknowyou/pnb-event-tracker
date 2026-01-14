'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface User {
  _id: string;
  username: string;
  displayName: string;
  isAdmin: boolean;
  isActive: boolean;
  languagePreference: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    displayName: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchUsers();
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setError('');
    setMessage('');

    if (!newUser.username || !newUser.password || !newUser.displayName) {
      setError(t('allFieldsRequired'));
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('createUserFailed'));
      }

      setMessage(t('userCreated'));
      setNewUser({ username: '', password: '', displayName: '' });
      setShowCreateDialog(false);
      fetchUsers();

      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || t('createUserFailed'));
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`${t('deleteConfirm')} "${username}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(t('userDeleted'));
        fetchUsers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || t('deleteUserFailed'));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(t('deleteUserFailed'));
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">{tCommon('loading')}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('description')}</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('createUser')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('createNewUser')}</DialogTitle>
              <DialogDescription>
                {t('createNewUserDesc')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="new-displayName">{t('profile.displayName', { ns: 'profile' })}</Label>
                <Input
                  id="new-displayName"
                  value={newUser.displayName}
                  onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <Label htmlFor="new-username">{t('profile.username', { ns: 'profile' })}</Label>
                <Input
                  id="new-username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="e.g., johndoe"
                  autoComplete="off"
                />
              </div>

              <div>
                <Label htmlFor="new-password">{t('login.password', { ns: 'login' })}</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                  autoComplete="new-password"
                />
              </div>

              <Button onClick={handleCreateUser} className="w-full">
                {t('createUser')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {users.map((u) => (
          <Card key={u._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {u.displayName}
                    {u.isAdmin && <Badge>{t('admin')}</Badge>}
                    {!u.isActive && <Badge variant="secondary">{t('inactive')}</Badge>}
                  </CardTitle>
                  <CardDescription>@{u.username}</CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  {/* Protect admin user - can't toggle or delete */}
                  {u.username === 'admin' ? (
                    <Badge variant="outline" className="bg-blue-50">{t('protectedAdmin')}</Badge>
                  ) : u._id !== user.id ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${u._id}`} className="text-sm">
                          {u.isActive ? t('active') : t('inactive')}
                        </Label>
                        <Switch
                          id={`active-${u._id}`}
                          checked={u.isActive}
                          onCheckedChange={() => handleToggleActive(u._id, u.isActive)}
                        />
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(u._id, u.username)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Badge variant="outline">{t('you')}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">{t('language')}:</span>{' '}
                  {u.languagePreference === 'zh' ? '中文' : 'English'}
                </div>
                <div>
                  <span className="text-gray-600">{t('created')}:</span>{' '}
                  {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {t('noUsers')}
          </div>
        )}
      </div>
    </div>
  );
}
