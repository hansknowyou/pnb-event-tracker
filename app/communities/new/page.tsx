'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LogoUpload from '@/components/LogoUpload';
import StaffRoleSelect from '@/components/StaffRoleSelect';
import PreviewLink from '@/components/PreviewLink';
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
import type { Company } from '@/types/company';
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
  const [logo, setLogo] = useState('');
  const [staff, setStaff] = useState<CommunityStaff[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Available options from database
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [availableRoles, setAvailableRoles] = useState<StaffRole[]>([]);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const getCompanyById = (companyId?: string) =>
    availableCompanies.find((company) => company._id === companyId);

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push('/communities');
    }
  }, [user, router]);

  // Fetch cities and staff roles on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [citiesRes, rolesRes, companiesRes] = await Promise.all([
          fetch('/api/cities'),
          fetch('/api/staff-roles'),
          fetch('/api/companies'),
        ]);
        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          setAvailableCities(citiesData);
        }
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          setAvailableRoles(rolesData);
        }
        if (companiesRes.ok) {
          const companiesData = await companiesRes.json();
          setAvailableCompanies(companiesData);
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
    setStaff([
      ...staff,
      { name: '', role: [], company: '', linkedCompanyId: '', linkedCompanyStaffId: '', email: '', phone: '' },
    ]);
  };

  const handleRemoveStaff = (index: number) => {
    setStaff(staff.filter((_, i) => i !== index));
  };

  const handleStaffChange = (
    index: number,
    field: keyof CommunityStaff,
    value: string | string[]
  ) => {
    const newStaff = [...staff];
    newStaff[index] = { ...newStaff[index], [field]: value };
    setStaff(newStaff);
  };

  const handleCompanySelect = (index: number, companyId: string) => {
    const company = availableCompanies.find((item) => item._id === companyId);
    const newStaff = [...staff];
    newStaff[index] = {
      ...newStaff[index],
      company: company?.name || '',
      linkedCompanyId: companyId,
      linkedCompanyStaffId: '',
    };
    setStaff(newStaff);
  };

  const handleCompanyStaffSelect = (index: number, staffId: string) => {
    const companyId = staff[index]?.linkedCompanyId;
    const company = availableCompanies.find((item) => item._id === companyId);
    const companyStaff = company?.staff?.find((member) => member._id === staffId);
    if (!companyStaff) return;

    const newStaff = [...staff];
    newStaff[index] = {
      ...newStaff[index],
      name: companyStaff.name || '',
      email: companyStaff.email || '',
      phone: companyStaff.phone || '',
      role: Array.isArray(companyStaff.role) ? companyStaff.role : [],
      company: company?.name || newStaff[index].company || '',
      linkedCompanyStaffId: staffId,
    };
    setStaff(newStaff);
  };

  const handleCompanyNameChange = (index: number, value: string) => {
    const newStaff = [...staff];
    newStaff[index] = {
      ...newStaff[index],
      company: value,
      linkedCompanyId: '',
      linkedCompanyStaffId: '',
    };
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
          logo,
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
          <LogoUpload
            label={t('logo')}
            helpText={t('logoHelp')}
            value={logo}
            onChange={setLogo}
            messages={{
              invalidType: t('logoInvalidType'),
              fileTooLarge: t('logoFileTooLarge'),
              dimensionTooLarge: t('logoDimensionTooLarge'),
              loadFailed: t('logoLoadFailed'),
              remove: t('logoRemove'),
              empty: t('logoEmpty'),
            }}
          />
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
            <div className="flex items-center gap-2">
              <Label htmlFor="files" className="mb-0">{t('files')}</Label>
              <PreviewLink href={files} />
            </div>
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
            <div className="flex items-center gap-2">
              <Label htmlFor="images" className="mb-0">{t('images')}</Label>
              <PreviewLink href={images} />
            </div>
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
              <div key={index} className="mb-2 p-3 border rounded-md bg-gray-50 space-y-3">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStaff(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500">{t('selectCompany')}</Label>
                    <Select
                      value={member.linkedCompanyId || ''}
                      onValueChange={(value) => handleCompanySelect(index, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('selectCompany')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCompanies.map((company) => (
                          <SelectItem key={company._id} value={company._id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getCompanyById(member.linkedCompanyId)?.logo && (
                      <div className="mt-2">
                        <img
                          src={getCompanyById(member.linkedCompanyId)?.logo as string}
                          alt={t('logo')}
                          className="h-8 w-8 rounded border border-gray-200 object-contain bg-white"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">{t('staffCompany')}</Label>
                    <Input
                      placeholder={t('staffCompany')}
                      value={member.company || ''}
                      onChange={(e) => handleCompanyNameChange(index, e.target.value)}
                      disabled={Boolean(member.linkedCompanyStaffId)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500">{t('selectCompanyStaff')}</Label>
                    <Select
                      value={member.linkedCompanyStaffId || ''}
                      onValueChange={(value) => handleCompanyStaffSelect(index, value)}
                      disabled={!member.linkedCompanyId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('selectCompanyStaff')} />
                      </SelectTrigger>
                      <SelectContent>
                        {(availableCompanies.find((c) => c._id === member.linkedCompanyId)?.staff || []).map(
                          (staffMember, staffIndex) => (
                            <SelectItem
                              key={staffMember._id || `staff-${staffIndex}`}
                              value={staffMember._id || `staff-${staffIndex}`}
                            >
                              {staffMember.name || staffMember.email || staffMember.phone || t('staffName')}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">{t('staffName')}</Label>
                    <Input
                      placeholder={t('staffName')}
                      value={member.name}
                      onChange={(e) => handleStaffChange(index, 'name', e.target.value)}
                      disabled={Boolean(member.linkedCompanyStaffId)}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">{t('selectRole')}</Label>
                  <StaffRoleSelect
                    value={Array.isArray(member.role) ? member.role : []}
                    onChange={(value) => handleStaffChange(index, 'role', value)}
                    availableRoles={availableRoles.map((role) => role.name)}
                    placeholder={t('selectRole')}
                    selectLabel={t('selectRole')}
                    emptyLabel={t('noRolesConfigured')}
                    disabled={Boolean(member.linkedCompanyStaffId)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder={t('staffEmail')}
                    value={member.email}
                    onChange={(e) => handleStaffChange(index, 'email', e.target.value)}
                    disabled={Boolean(member.linkedCompanyStaffId)}
                  />
                  <Input
                    placeholder={t('staffPhone')}
                    value={member.phone}
                    onChange={(e) => handleStaffChange(index, 'phone', e.target.value)}
                    disabled={Boolean(member.linkedCompanyStaffId)}
                  />
                </div>
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
