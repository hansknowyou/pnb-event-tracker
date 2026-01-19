'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VenueCard from '@/components/VenueCard';
import { useAuth } from '@/contexts/AuthContext';
import type { Venue } from '@/types/venue';
import { useTranslations } from 'next-intl';

export default function VenuesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations('venues');
  const [items, setItems] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/venues');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
      <style jsx global>{`
        @media print {
          nav,
          button,
          .no-print {
            display: none !important;
          }
          .venue-card {
            page-break-inside: avoid;
            border: 1px solid #ccc;
            padding: 1rem;
            margin-bottom: 1rem;
          }
          body {
            background: white;
          }
        }
      `}</style>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2 no-print">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          {user?.isAdmin && (
            <Button onClick={() => router.push('/venues/new')}>
              <Plus className="w-4 h-4 mr-2" />
              {t('addVenue')}
            </Button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{t('noVenues')}</p>
          {user?.isAdmin && (
            <Button onClick={() => router.push('/venues/new')}>
              <Plus className="w-4 h-4 mr-2" />
              {t('createFirst')}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="venue-card">
              <VenueCard
                item={item}
                onEdit={() => router.push(`/venues/${item._id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
