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
      setError('All fields are required');
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
        throw new Error(data.error || 'Failed to create user');
      }

      setMessage('User created successfully!');
      setNewUser({ username: '', password: '', displayName: '' });
      setShowCreateDialog(false);
      fetchUsers();

      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
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
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('User deleted successfully');
        fetchUsers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600 mt-2">Manage system users and permissions</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="new-displayName">Display Name</Label>
                <Input
                  id="new-displayName"
                  value={newUser.displayName}
                  onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <Label htmlFor="new-username">Username</Label>
                <Input
                  id="new-username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="e.g., johndoe"
                  autoComplete="off"
                />
              </div>

              <div>
                <Label htmlFor="new-password">Password</Label>
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
                Create User
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
                    {u.isAdmin && <Badge>Admin</Badge>}
                    {!u.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </CardTitle>
                  <CardDescription>@{u.username}</CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  {u._id !== user.id && (
                    <>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${u._id}`} className="text-sm">
                          {u.isActive ? 'Active' : 'Inactive'}
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
                  )}
                  {u._id === user.id && (
                    <Badge variant="outline">You</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Language:</span>{' '}
                  {u.languagePreference === 'zh' ? '中文' : 'English'}
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>{' '}
                  {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found. Create your first user to get started.
          </div>
        )}
      </div>
    </div>
  );
}
