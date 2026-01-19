'use client';

import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface User {
  _id: string;
  username: string;
  displayName: string;
}

interface AssignButtonProps {
  section: string;
  assignedUserId?: string;
  productionId: string;
  onChange: (section: string, userId: string | null) => void;
}

export default function AssignButton({
  section,
  assignedUserId,
  productionId,
  onChange,
}: AssignButtonProps) {
  const t = useTranslations('assign');
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(assignedUserId || '');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  useEffect(() => {
    setSelectedUserId(assignedUserId || '');
  }, [assignedUserId]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        // Filter to only active users
        setUsers(data.filter((u: User & { isActive: boolean }) => u.isActive !== false));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Update production assignments
      await fetch(`/api/productions/${productionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [`assignments.${section}`]: selectedUserId || null,
        }),
      });

      onChange(section, selectedUserId || null);
      setOpen(false);
    } catch (error) {
      console.error('Error saving assignment:', error);
      alert(t('saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const getAssignedUserName = () => {
    if (!assignedUserId) return null;
    const user = users.find((u) => u._id === assignedUserId);
    return user?.displayName || user?.username;
  };

  const assignedName = getAssignedUserName();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        {assignedName ? assignedName : t('assign')}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('assignStep')}</DialogTitle>
            <DialogDescription>
              {t('assignDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {loading ? (
              <div className="text-center py-4 text-gray-500">{t('loadingUsers')}</div>
            ) : (
              <div className="space-y-2">
                <Label>{t('assignTo')}</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectUser')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('unassigned')}</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.displayName || user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
