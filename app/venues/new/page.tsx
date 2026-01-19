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
import type { VenueStaff } from '@/types/venue';
import type { City } from '@/types/city';
import type { StaffRole } from '@/types/staffRole';

export default function NewVenuePage() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations('venues');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [intro, setIntro] = useState('');
  const [staff, setStaff] = useState<VenueStaff[]>([]);
  const [image, setImage] = useState('');
  const [otherImages, setOtherImages] = useState<string[]>([]);
  const [files, setFiles] = useState('');
  const [mediaRequirements, setMediaRequirements] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Available options from database
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [availableRoles, setAvailableRoles] = useState<StaffRole[]>([]);

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/venues');
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

  const handleStaffChange = (index: number, field: keyof VenueStaff, value: string) => {
    const newStaff = [...staff];
    newStaff[index] = { ...newStaff[index], [field]: value };
    setStaff(newStaff);
  };

  const handleAddOtherImage = () => {
    setOtherImages([...otherImages, '']);
  };

  const handleRemoveOtherImage = (index: number) => {
    setOtherImages(otherImages.filter((_, i) => i !== index));
  };

  const handleOtherImageChange = (index: number, value: string) => {
    const newImages = [...otherImages];
    newImages[index] = value;
    setOtherImages(newImages);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError(t('nameRequired'));
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          location,
          city,
          intro,
          staff: staff.filter(s => s.name || s.email || s.phone),
          image,
          otherImages: otherImages.filter(Boolean),
          files,
          mediaRequirements,
          notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('createFailed'));
      }

      const data = await response.json();
      router.push(`/venues/${data._id}`);
    } catch (err) {
      console.error('Error creating venue:', err);
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
          onClick={() => router.push('/venues')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
        <h1 className="text-3xl font-bold">{t('createVenue')}</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('venueDetails')}</CardTitle>
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

          {/* City & Location */}
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
              <Label htmlFor="location">{t('location')}</Label>
              <Input
                id="location"
                placeholder={t('locationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Intro */}
          <div>
            <Label htmlFor="intro">{t('intro')}</Label>
            <Textarea
              id="intro"
              placeholder={t('introPlaceholder')}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={4}
            />
          </div>

          {/* Main Image */}
          <div>
            <Label htmlFor="image">{t('mainImage')}</Label>
            <Input
              id="image"
              placeholder={t('imagePlaceholder')}
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {/* Other Images */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>{t('otherImages')}</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddOtherImage}>
                <Plus className="w-4 h-4 mr-1" />
                {t('addImage')}
              </Button>
            </div>
            {otherImages.map((img, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder={t('imagePlaceholder')}
                  value={img}
                  onChange={(e) => handleOtherImageChange(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOtherImage(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
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

          {/* Media Requirements */}
          <div>
            <Label htmlFor="mediaRequirements">{t('mediaRequirements')}</Label>
            <Textarea
              id="mediaRequirements"
              placeholder={t('mediaRequirementsPlaceholder')}
              value={mediaRequirements}
              onChange={(e) => setMediaRequirements(e.target.value)}
              rows={4}
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">{t('notes')}</Label>
            <Textarea
              id="notes"
              placeholder={t('notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/venues')}
            >
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={saving || !name.trim()}>
              {saving ? (
                <>{t('saving')}</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('createVenue')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
