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
import PreviewLink from '@/components/PreviewLink';
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
import type { Community, CommunityStaff } from '@/types/community';
import type { Company } from '@/types/company';
import type { City } from '@/types/city';
import type { StaffRole } from '@/types/staffRole';

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const t = useTranslations('communities');
  const communityId = params?.id as string;

  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  // Available options from database
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [availableRoles, setAvailableRoles] = useState<StaffRole[]>([]);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const getCompanyById = (companyId?: string) =>
    availableCompanies.find((company) => company._id === companyId);

  useEffect(() => {
    fetchCommunity();
    fetchOptions();
  }, [communityId]);

  const fetchCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}`);
      if (response.ok) {
        const data = await response.json();
        const normalizedStaff = (data.staff || []).map((member: CommunityStaff) => ({
          ...member,
          role: Array.isArray(member.role)
            ? member.role
            : member.role
              ? [member.role]
              : [],
          company: member.company || '',
          linkedCompanyId: member.linkedCompanyId || '',
          linkedCompanyStaffId: member.linkedCompanyStaffId || '',
        }));
        setCommunity({ ...data, staff: normalizedStaff });
      } else {
        router.push('/communities');
      }
    } catch (error) {
      console.error('Error fetching community:', error);
      router.push('/communities');
    } finally {
      setLoading(false);
    }
  };

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

  // Auto-save with debounce
  useEffect(() => {
    if (!hasChanges || !community) return;

    const timer = setTimeout(() => {
      saveCommunity();
    }, 2000);

    return () => clearTimeout(timer);
  }, [community, hasChanges]);

  const saveCommunity = useCallback(async () => {
    if (!community) return;

    setSaving(true);
    setSaveStatus('saving');

    try {
      const response = await fetch(`/api/communities/${communityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(community),
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
      console.error('Error saving community:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setSaving(false);
    }
  }, [community, communityId]);

  const updateCommunity = (updates: Partial<Community>) => {
    if (community) {
      setCommunity({ ...community, ...updates });
      setHasChanges(true);
    }
  };

  const handleAddStaff = () => {
    if (community) {
      const newStaff: CommunityStaff = {
        name: '',
        role: [],
        company: '',
        linkedCompanyId: '',
        linkedCompanyStaffId: '',
        email: '',
        phone: '',
      };
      updateCommunity({ staff: [...(community.staff || []), newStaff] });
    }
  };

  const handleRemoveStaff = (index: number) => {
    if (community) {
      updateCommunity({ staff: community.staff.filter((_, i) => i !== index) });
    }
  };

  const handleStaffChange = (
    index: number,
    field: keyof CommunityStaff,
    value: string | string[]
  ) => {
    if (community) {
      const newStaff = [...community.staff];
      newStaff[index] = { ...newStaff[index], [field]: value };
      updateCommunity({ staff: newStaff });
    }
  };

  const handleCompanySelect = (index: number, companyId: string) => {
    if (!community) return;
    const company = availableCompanies.find((item) => item._id === companyId);
    const newStaff = [...community.staff];
    newStaff[index] = {
      ...newStaff[index],
      company: company?.name || '',
      linkedCompanyId: companyId,
      linkedCompanyStaffId: '',
    };
    updateCommunity({ staff: newStaff });
  };

  const handleCompanyStaffSelect = (index: number, staffId: string) => {
    if (!community) return;
    const companyId = community.staff[index]?.linkedCompanyId;
    const company = availableCompanies.find((item) => item._id === companyId);
    const companyStaff = company?.staff?.find((member) => member._id === staffId);
    if (!companyStaff) return;

    const newStaff = [...community.staff];
    newStaff[index] = {
      ...newStaff[index],
      name: companyStaff.name || '',
      email: companyStaff.email || '',
      phone: companyStaff.phone || '',
      role: Array.isArray(companyStaff.role) ? companyStaff.role : [],
      company: company?.name || newStaff[index].company || '',
      linkedCompanyStaffId: staffId,
    };
    updateCommunity({ staff: newStaff });
  };

  const handleCompanyNameChange = (index: number, value: string) => {
    if (!community) return;
    const newStaff = [...community.staff];
    newStaff[index] = {
      ...newStaff[index],
      company: value,
      linkedCompanyId: '',
      linkedCompanyStaffId: '',
    };
    updateCommunity({ staff: newStaff });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/communities/${communityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/communities');
      }
    } catch (error) {
      console.error('Error deleting community:', error);
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

  if (!community) {
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
            onClick={() => router.push('/communities')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
          <h1 className="text-3xl font-bold">{isAdmin ? t('editCommunity') : community.name}</h1>
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
          <CardTitle>{t('communityDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LogoUpload
            label={t('logo')}
            helpText={t('logoHelp')}
            value={community.logo || ''}
            onChange={(value) => updateCommunity({ logo: value })}
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
              value={community.name}
              onChange={(e) => updateCommunity({ name: e.target.value })}
              onBlur={saveCommunity}
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
                  <Select value={community.city} onValueChange={(value) => updateCommunity({ city: value })}>
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
                <Input value={community.city} disabled />
              )}
            </div>
            <div>
              <Label htmlFor="address">{t('address')}</Label>
              <Input
                id="address"
                placeholder={t('addressPlaceholder')}
                value={community.address}
                onChange={(e) => updateCommunity({ address: e.target.value })}
                onBlur={saveCommunity}
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
              value={community.description}
              onChange={(e) => updateCommunity({ description: e.target.value })}
              onBlur={saveCommunity}
              disabled={!isAdmin}
              rows={4}
            />
          </div>

          {/* Files (Google Drive) */}
          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="files" className="mb-0">{t('files')}</Label>
              <PreviewLink href={community.files} />
            </div>
            <div className="flex gap-2">
              <Input
                id="files"
                placeholder={t('filesPlaceholder')}
                value={community.files}
                onChange={(e) => updateCommunity({ files: e.target.value })}
                onBlur={saveCommunity}
                disabled={!isAdmin}
                className="flex-1"
              />
              {community.files && (
                <a href={community.files} target="_blank" rel="noopener noreferrer">
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
            <div className="flex items-center gap-2">
              <Label htmlFor="images" className="mb-0">{t('images')}</Label>
              <PreviewLink href={community.images} />
            </div>
            <div className="flex gap-2">
              <Input
                id="images"
                placeholder={t('imagesPlaceholder')}
                value={community.images}
                onChange={(e) => updateCommunity({ images: e.target.value })}
                onBlur={saveCommunity}
                disabled={!isAdmin}
                className="flex-1"
              />
              {community.images && (
                <a href={community.images} target="_blank" rel="noopener noreferrer">
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
            {availableRoles.length === 0 && community.staff?.length > 0 && isAdmin && (
              <p className="text-xs text-gray-500 mb-2">{t('noRolesConfigured')}</p>
            )}
            {community.staff?.map((member, index) => (
              <div key={index} className="mb-2 p-3 border rounded-md bg-gray-50 space-y-3">
                {isAdmin && (
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
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500">{t('selectCompany')}</Label>
                    {isAdmin ? (
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
                    ) : (
                      <Input value={member.company || ''} disabled />
                    )}
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
                      onBlur={saveCommunity}
                      disabled={!isAdmin || Boolean(member.linkedCompanyStaffId)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500">{t('selectCompanyStaff')}</Label>
                    {isAdmin ? (
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
                    ) : (
                      <Input value={member.name} disabled />
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">{t('staffName')}</Label>
                    <Input
                      placeholder={t('staffName')}
                      value={member.name}
                      onChange={(e) => handleStaffChange(index, 'name', e.target.value)}
                      onBlur={saveCommunity}
                      disabled={!isAdmin || Boolean(member.linkedCompanyStaffId)}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">{t('selectRole')}</Label>
                  {isAdmin ? (
                    <StaffRoleSelect
                      value={Array.isArray(member.role) ? member.role : []}
                      onChange={(value) => handleStaffChange(index, 'role', value)}
                      availableRoles={availableRoles.map((role) => role.name)}
                      placeholder={t('selectRole')}
                      selectLabel={t('selectRole')}
                      emptyLabel={t('noRolesConfigured')}
                      disabled={Boolean(member.linkedCompanyStaffId)}
                    />
                  ) : (
                    <Input value={(member.role || []).join(', ')} disabled />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder={t('staffEmail')}
                    value={member.email}
                    onChange={(e) => handleStaffChange(index, 'email', e.target.value)}
                    onBlur={saveCommunity}
                    disabled={!isAdmin || Boolean(member.linkedCompanyStaffId)}
                  />
                  <Input
                    placeholder={t('staffPhone')}
                    value={member.phone}
                    onChange={(e) => handleStaffChange(index, 'phone', e.target.value)}
                    onBlur={saveCommunity}
                    disabled={!isAdmin || Boolean(member.linkedCompanyStaffId)}
                  />
                </div>
              </div>
            ))}
            {(!community.staff || community.staff.length === 0) && (
              <p className="text-sm text-gray-500">{t('noStaff')}</p>
            )}
          </div>

          {/* Save Button */}
          {isAdmin && (
            <div className="flex justify-end">
              <Button onClick={saveCommunity} disabled={saving}>
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
