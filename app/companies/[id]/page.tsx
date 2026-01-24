'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import StaffRoleSelect from '@/components/StaffRoleSelect';
import LogoUpload from '@/components/LogoUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import type { Company, CompanyStaff } from '@/types/company';
import type { City } from '@/types/city';
import type { StaffRole } from '@/types/staffRole';

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const t = useTranslations('companies');
  const companyId = params?.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  // Available options from database
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [availableRoles, setAvailableRoles] = useState<StaffRole[]>([]);

  useEffect(() => {
    fetchCompany();
    fetchOptions();
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/companies/${companyId}`);
      if (response.ok) {
        const data = await response.json();
        const normalizedStaff = (data.staff || []).map((member: CompanyStaff) => ({
          ...member,
          role: Array.isArray(member.role)
            ? member.role
            : member.role
              ? [member.role]
              : [],
        }));
        setCompany({ ...data, staff: normalizedStaff });
      } else {
        router.push('/companies');
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      router.push('/companies');
    } finally {
      setLoading(false);
    }
  };

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

  // Auto-save with debounce
  useEffect(() => {
    if (!hasChanges || !company) return;

    const timer = setTimeout(() => {
      saveCompany();
    }, 2000);

    return () => clearTimeout(timer);
  }, [company, hasChanges]);

  const saveCompany = useCallback(async () => {
    if (!company) return;

    setSaving(true);
    setSaveStatus('saving');

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company),
      });

      if (response.ok) {
        setHasChanges(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
      console.error('Error saving company:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setSaving(false);
    }
  }, [company, companyId]);

  const updateCompany = (updates: Partial<Company>) => {
    if (company) {
      setCompany({ ...company, ...updates });
      setHasChanges(true);
    }
  };

  const handleAddStaff = () => {
    if (company) {
      const newStaff: CompanyStaff = { name: '', role: [], email: '', phone: '' };
      updateCompany({ staff: [...(company.staff || []), newStaff] });
    }
  };

  const handleRemoveStaff = (index: number) => {
    if (company) {
      updateCompany({ staff: company.staff.filter((_, i) => i !== index) });
    }
  };

  const handleStaffChange = (
    index: number,
    field: keyof CompanyStaff,
    value: string | string[]
  ) => {
    if (company) {
      const newStaff = [...company.staff];
      newStaff[index] = { ...newStaff[index], [field]: value };
      updateCompany({ staff: newStaff });
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/companies');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Format city display name
  const formatCityName = (c: City) => {
    const parts = [c.cityName];
    if (c.province) parts.push(c.province);
    if (c.country) parts.push(c.country);
    return parts.join(', ');
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

  if (!company) {
    return null;
  }

  const isAdmin = user?.isAdmin;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/companies')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
          <h1 className="text-3xl font-bold">{isAdmin ? t('editCompany') : company.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          {saveStatus === 'saving' && (
            <span className="text-sm text-blue-600">{t('saving')}</span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-sm text-green-600">{t('saved')}</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-sm text-red-600">{t('errorSaving')}</span>
          )}
          {hasChanges && !saveStatus && (
            <span className="text-sm text-yellow-600">{t('unsavedChanges')}</span>
          )}
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('deleteConfirm')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('deleteDescription')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleting ? t('deleting') : t('delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('companyDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LogoUpload
            label={t('logo')}
            helpText={t('logoHelp')}
            value={company.logo || ''}
            onChange={(value) => updateCompany({ logo: value })}
            disabled={!isAdmin}
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
              value={company.name}
              onChange={(e) => updateCompany({ name: e.target.value })}
              onBlur={saveCompany}
              disabled={!isAdmin}
              maxLength={200}
            />
          </div>

          {/* City & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">{t('city')}</Label>
              {isAdmin ? (
                <>
                  <Select value={company.city} onValueChange={(value) => updateCompany({ city: value })}>
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
                </>
              ) : (
                <Input value={company.city} disabled />
              )}
            </div>
            <div>
              <Label htmlFor="address">{t('address')}</Label>
              <Input
                id="address"
                placeholder={t('addressPlaceholder')}
                value={company.address}
                onChange={(e) => updateCompany({ address: e.target.value })}
                onBlur={saveCompany}
                disabled={!isAdmin}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              placeholder={t('descriptionPlaceholder')}
              value={company.description}
              onChange={(e) => updateCompany({ description: e.target.value })}
              onBlur={saveCompany}
              disabled={!isAdmin}
              rows={4}
            />
          </div>

          {/* Files (Google Drive) */}
          <div>
            <Label htmlFor="files">{t('files')}</Label>
            <div className="flex gap-2">
              <Input
                id="files"
                placeholder={t('filesPlaceholder')}
                value={company.files}
                onChange={(e) => updateCompany({ files: e.target.value })}
                onBlur={saveCompany}
                disabled={!isAdmin}
                className="flex-1"
              />
              {company.files && (
                <a href={company.files} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('filesHelp')}</p>
          </div>

          {/* Images (Google Drive) */}
          <div>
            <Label htmlFor="images">{t('images')}</Label>
            <div className="flex gap-2">
              <Input
                id="images"
                placeholder={t('imagesPlaceholder')}
                value={company.images}
                onChange={(e) => updateCompany({ images: e.target.value })}
                onBlur={saveCompany}
                disabled={!isAdmin}
                className="flex-1"
              />
              {company.images && (
                <a href={company.images} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('imagesHelp')}</p>
          </div>

          {/* Staff */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>{t('staff')}</Label>
              {isAdmin && (
                <Button type="button" variant="outline" size="sm" onClick={handleAddStaff}>
                  <Plus className="w-4 h-4 mr-1" />
                  {t('addStaff')}
                </Button>
              )}
            </div>
            {availableRoles.length === 0 && company.staff?.length > 0 && isAdmin && (
              <p className="text-xs text-gray-500 mb-2">{t('noRolesConfigured')}</p>
            )}
            {company.staff?.map((member, index) => (
              <div key={index} className="flex gap-2 mb-2 p-3 border rounded-md bg-gray-50">
                <Input
                  placeholder={t('staffName')}
                  value={member.name}
                  onChange={(e) => handleStaffChange(index, 'name', e.target.value)}
                  onBlur={saveCompany}
                  disabled={!isAdmin}
                  className="flex-1"
                />
                {isAdmin ? (
                  <StaffRoleSelect
                    value={Array.isArray(member.role) ? member.role : []}
                    onChange={(value) => handleStaffChange(index, 'role', value)}
                    availableRoles={availableRoles.map((role) => role.name)}
                    placeholder={t('selectRole')}
                    selectLabel={t('selectRole')}
                    emptyLabel={t('noRolesConfigured')}
                  />
                ) : (
                  <Input value={(member.role || []).join(', ')} disabled className="flex-1" />
                )}
                <Input
                  placeholder={t('staffEmail')}
                  value={member.email}
                  onChange={(e) => handleStaffChange(index, 'email', e.target.value)}
                  onBlur={saveCompany}
                  disabled={!isAdmin}
                  className="flex-1"
                />
                <Input
                  placeholder={t('staffPhone')}
                  value={member.phone}
                  onChange={(e) => handleStaffChange(index, 'phone', e.target.value)}
                  onBlur={saveCompany}
                  disabled={!isAdmin}
                  className="flex-1"
                />
                {isAdmin && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStaff(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            {(!company.staff || company.staff.length === 0) && (
              <p className="text-sm text-gray-500">{t('noStaff')}</p>
            )}
          </div>

          {/* Save Button */}
          {isAdmin && (
            <div className="flex justify-end">
              <Button onClick={saveCompany} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? t('saving') : t('saveChanges')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
