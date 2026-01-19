'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CommunityCard from '@/components/CommunityCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import type { Community } from '@/types/community';

export default function CommunitiesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations('communities');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities');
      if (response.ok) {
        const data = await response.json();
        setCommunities(data);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;

    try {
      const response = await fetch(`/api/communities/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCommunities(communities.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error('Error deleting community:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        {user?.isAdmin && (
          <Button onClick={() => router.push('/communities/new')}>
            <Plus className="w-4 h-4 mr-2" />
            {t('addCommunity')}
          </Button>
        )}
      </div>

      {communities.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">{t('noCommunities')}</p>
          {user?.isAdmin && (
            <Button onClick={() => router.push('/communities/new')}>
              <Plus className="w-4 h-4 mr-2" />
              {t('createFirst')}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <CommunityCard
              key={community._id}
              community={community}
              onDelete={user?.isAdmin ? () => handleDelete(community._id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
