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
import { Plus, Trash2, Edit, UserCog } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AdminNav from '@/components/AdminNav';
import type { StaffRole } from '@/types/staffRole';

export default function StaffRoleManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('staffRoles');
  const tCommon = useTranslations('common');
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<StaffRole | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchRoles();
  }, [user, router]);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/staff-roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Error fetching staff roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    setError('');
    setMessage('');

    if (!newRoleName.trim()) {
      setError(t('roleNameRequired'));
      return;
    }

    try {
      const response = await fetch('/api/staff-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoleName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('createFailed'));
      }

      setMessage(t('roleCreated'));
      setNewRoleName('');
      setShowCreateDialog(false);
      fetchRoles();

      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('createFailed');
      setError(errorMessage);
    }
  };

  const handleEditRole = async () => {
    if (!editingRole) return;
    setError('');
    setMessage('');

    if (!editingRole.name.trim()) {
      setError(t('roleNameRequired'));
      return;
    }

    try {
      const response = await fetch(`/api/staff-roles/${editingRole._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingRole.name }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('updateFailed'));
      }

      setMessage(t('roleUpdated'));
      setShowEditDialog(false);
      setEditingRole(null);
      fetchRoles();

      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('updateFailed');
      setError(errorMessage);
    }
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!confirm(`${t('deleteConfirm')} "${roleName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/staff-roles/${roleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(t('roleDeleted'));
        fetchRoles();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || t('deleteFailed'));
      }
    } catch (error) {
      console.error('Error deleting staff role:', error);
      setError(t('deleteFailed'));
    }
  };

  const openEditDialog = (role: StaffRole) => {
    setEditingRole({ ...role });
    setShowEditDialog(true);
    setError('');
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
              {t('addRole')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('createRole')}</DialogTitle>
              <DialogDescription>{t('createRoleDesc')}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="new-roleName">
                  {t('roleName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new-roleName"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder={t('roleNamePlaceholder')}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                {tCommon('cancel')}
              </Button>
              <Button onClick={handleCreateRole}>{t('addRole')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}

      {roles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('noRoles')}</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              {t('rolesList')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {roles.map((role) => (
                <div
                  key={role._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="font-medium">{role.name}</div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(role)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRole(role._id, role.name)}
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('editRole')}</DialogTitle>
            <DialogDescription>{t('editRoleDesc')}</DialogDescription>
          </DialogHeader>

          {editingRole && (
            <div className="space-y-4 py-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="edit-roleName">
                  {t('roleName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-roleName"
                  value={editingRole.name}
                  onChange={(e) =>
                    setEditingRole({ ...editingRole, name: e.target.value })
                  }
                  placeholder={t('roleNamePlaceholder')}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              {tCommon('cancel')}
            </Button>
            <Button onClick={handleEditRole}>{tCommon('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
