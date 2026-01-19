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
import { Plus, Trash2, Edit, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AdminNav from '@/components/AdminNav';
import type { City } from '@/types/city';

export default function CityManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('cities');
  const tCommon = useTranslations('common');
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [newCity, setNewCity] = useState({
    cityName: '',
    province: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchCities();
  }, [user, router]);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities');
      if (response.ok) {
        const data = await response.json();
        setCities(data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCity = async () => {
    setError('');
    setMessage('');

    if (!newCity.cityName.trim()) {
      setError(t('cityNameRequired'));
      return;
    }

    try {
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCity),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('createFailed'));
      }

      setMessage(t('cityCreated'));
      setNewCity({ cityName: '', province: '', country: '' });
      setShowCreateDialog(false);
      fetchCities();

      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('createFailed');
      setError(errorMessage);
    }
  };

  const handleEditCity = async () => {
    if (!editingCity) return;
    setError('');
    setMessage('');

    if (!editingCity.cityName.trim()) {
      setError(t('cityNameRequired'));
      return;
    }

    try {
      const response = await fetch(`/api/cities/${editingCity._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: editingCity.cityName,
          province: editingCity.province,
          country: editingCity.country,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('updateFailed'));
      }

      setMessage(t('cityUpdated'));
      setShowEditDialog(false);
      setEditingCity(null);
      fetchCities();

      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('updateFailed');
      setError(errorMessage);
    }
  };

  const handleDeleteCity = async (cityId: string, cityName: string) => {
    if (!confirm(`${t('deleteConfirm')} "${cityName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/cities/${cityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(t('cityDeleted'));
        fetchCities();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || t('deleteFailed'));
      }
    } catch (error) {
      console.error('Error deleting city:', error);
      setError(t('deleteFailed'));
    }
  };

  const openEditDialog = (city: City) => {
    setEditingCity({ ...city });
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

  // Group cities by country
  const citiesByCountry = cities.reduce((acc, city) => {
    const country = city.country || t('noCountry');
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(city);
    return acc;
  }, {} as Record<string, City[]>);

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
              {t('addCity')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('createCity')}</DialogTitle>
              <DialogDescription>{t('createCityDesc')}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="new-cityName">
                  {t('cityName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new-cityName"
                  value={newCity.cityName}
                  onChange={(e) => setNewCity({ ...newCity, cityName: e.target.value })}
                  placeholder={t('cityNamePlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="new-province">{t('province')}</Label>
                <Input
                  id="new-province"
                  value={newCity.province}
                  onChange={(e) => setNewCity({ ...newCity, province: e.target.value })}
                  placeholder={t('provincePlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="new-country">{t('country')}</Label>
                <Input
                  id="new-country"
                  value={newCity.country}
                  onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}
                  placeholder={t('countryPlaceholder')}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                {tCommon('cancel')}
              </Button>
              <Button onClick={handleCreateCity}>{t('addCity')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}

      {Object.keys(citiesByCountry).length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('noCities')}</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(citiesByCountry).map(([country, countryCities]) => (
            <Card key={country}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {country}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {countryCities.map((city) => (
                    <div
                      key={city._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{city.cityName}</div>
                        {city.province && (
                          <div className="text-sm text-gray-500">{city.province}</div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(city)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCity(city._id, city.cityName)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('editCity')}</DialogTitle>
            <DialogDescription>{t('editCityDesc')}</DialogDescription>
          </DialogHeader>

          {editingCity && (
            <div className="space-y-4 py-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="edit-cityName">
                  {t('cityName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-cityName"
                  value={editingCity.cityName}
                  onChange={(e) =>
                    setEditingCity({ ...editingCity, cityName: e.target.value })
                  }
                  placeholder={t('cityNamePlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="edit-province">{t('province')}</Label>
                <Input
                  id="edit-province"
                  value={editingCity.province}
                  onChange={(e) =>
                    setEditingCity({ ...editingCity, province: e.target.value })
                  }
                  placeholder={t('provincePlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="edit-country">{t('country')}</Label>
                <Input
                  id="edit-country"
                  value={editingCity.country}
                  onChange={(e) =>
                    setEditingCity({ ...editingCity, country: e.target.value })
                  }
                  placeholder={t('countryPlaceholder')}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              {tCommon('cancel')}
            </Button>
            <Button onClick={handleEditCity}>{tCommon('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
