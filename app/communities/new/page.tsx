'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import type { CommunityStaff } from '@/types/community';
import type { City } from '@/types/city';
import type { StaffRole } from '@/types/staffRole';

export default function NewCommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations('communities');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState('');
  const [images, setImages] = useState('');
  const [staff, setStaff] = useState<CommunityStaff[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Available options from database
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [availableRoles, setAvailableRoles] = useState<StaffRole[]>([]);

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/communities');
    }
  }, [user, router]);

  // Fetch cities and staff roles on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [citiesRes, rolesRes] = await Promise.all([
          fetch('/api/cities'),
          fetch('/api/staff-roles'),
        ]);
        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          setAvailableCities(citiesData);
        }
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          setAvailableRoles(rolesData);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
  }, []);

  if (!user || !user.isAdmin) {
    return null;
  }

  const handleAddStaff = () => {
    setStaff([...staff, { name: '', role: '', email: '', phone: '' }]);
  };

  const handleRemoveStaff = (index: number) => {
    setStaff(staff.filter((_, i) => i !== index));
  };

  const handleStaffChange = (index: number, field: keyof CommunityStaff, value: string) => {
    const newStaff = [...staff];
    newStaff[index] = { ...newStaff[index], [field]: value };
    setStaff(newStaff);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError(t('nameRequired'));
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          address,
          city,
          description,
          files,
          images,
          staff: staff.filter(s => s.name || s.email || s.phone),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('createFailed'));
      }

      const data = await response.json();
      router.push(`/communities/${data._id}`);
    } catch (err) {
      console.error('Error creating community:', err);
      setError(err instanceof Error ? err.message : t('createFailed'));
    } finally {
      setSaving(false);
    }
  };

  // Format city display name
  const formatCityName = (c: City) => {
    const parts = [c.cityName];
    if (c.province) parts.push(c.province);
    if (c.country) parts.push(c.country);
    return parts.join(', ');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/communities')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
        <h1 className="text-3xl font-bold">{t('createCommunity')}</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('communityDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">
              {t('name')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder={t('namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={200}
            />
          </div>

          {/* City & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">{t('city')}</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('selectCity')} />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((c) => (
                    <SelectItem key={c._id} value={formatCityName(c)}>
                      {formatCityName(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableCities.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">{t('noCitiesConfigured')}</p>
              )}
            </div>
            <div>
              <Label htmlFor="address">{t('address')}</Label>
              <Input
                id="address"
                placeholder={t('addressPlaceholder')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              placeholder={t('descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Files (Google Drive) */}
          <div>
            <Label htmlFor="files">{t('files')}</Label>
            <Input
              id="files"
              placeholder={t('filesPlaceholder')}
              value={files}
              onChange={(e) => setFiles(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">{t('filesHelp')}</p>
          </div>

          {/* Images (Google Drive) */}
          <div>
            <Label htmlFor="images">{t('images')}</Label>
            <Input
              id="images"
              placeholder={t('imagesPlaceholder')}
              value={images}
              onChange={(e) => setImages(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">{t('imagesHelp')}</p>
          </div>

          {/* Staff */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>{t('staff')}</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddStaff}>
                <Plus className="w-4 h-4 mr-1" />
                {t('addStaff')}
              </Button>
            </div>
            {availableRoles.length === 0 && staff.length > 0 && (
              <p className="text-xs text-gray-500 mb-2">{t('noRolesConfigured')}</p>
            )}
            {staff.map((member, index) => (
              <div key={index} className="flex gap-2 mb-2 p-3 border rounded-md bg-gray-50">
                <Input
                  placeholder={t('staffName')}
                  value={member.name}
                  onChange={(e) => handleStaffChange(index, 'name', e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={member.role}
                  onValueChange={(value) => handleStaffChange(index, 'role', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={t('selectRole')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role._id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder={t('staffEmail')}
                  value={member.email}
                  onChange={(e) => handleStaffChange(index, 'email', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder={t('staffPhone')}
                  value={member.phone}
                  onChange={(e) => handleStaffChange(index, 'phone', e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveStaff(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/communities')}
            >
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={saving || !name.trim()}>
              {saving ? (
                <>{t('saving')}</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('createCommunity')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
