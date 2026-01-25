'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
import {
  Edit,
  FileDown,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Circle,
} from 'lucide-react';
import LoadingOverlay from '@/components/LoadingOverlay';
import type { Production } from '@/types/production';
import { STEPS } from '@/types/production';

export default function ProductionDashboard() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations('production');
  const tCommon = useTranslations('common');
  const tStep = useTranslations('stepConfig');
  const productionId = params?.id as string;
  const [production, setProduction] = useState<Production | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  useEffect(() => {
    fetchProduction();
  }, [productionId]);

  // Refetch data when window gains focus (user returns from edit page)
  useEffect(() => {
    const handleFocus = () => {
      fetchProduction();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [productionId]);

  const fetchProduction = async () => {
    try {
      const response = await fetch(`/api/productions/${productionId}`);
      if (response.ok) {
        const data = await response.json();
        setProduction(data);
      }
    } catch (error) {
      console.error('Error fetching production:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTitle = async (newTitle: string) => {
    if (!production) return;

    setIsSavingTitle(true);
    try {
      const response = await fetch(`/api/productions/${productionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        const updated = await response.json();
        setProduction(updated);
      }
    } catch (error) {
      console.error('Error updating title:', error);
    } finally {
      setIsSavingTitle(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(t('copiedToClipboard'));
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStepStatus = (stepData: any): 'completed' | 'in-progress' | 'not-started' => {
    // Simplified status calculation
    if (!stepData) return 'not-started';

    // Check if it's an array
    if (Array.isArray(stepData)) {
      return stepData.length > 0 ? 'in-progress' : 'not-started';
    }

    // Check if it's an object with fields
    if (typeof stepData === 'object') {
      const hasData = Object.values(stepData).some((value) => {
        if (typeof value === 'string') return value.trim().length > 0;
        if (typeof value === 'boolean') return value;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some((v) => {
            if (typeof v === 'string') return v.trim().length > 0;
            if (Array.isArray(v)) return v.length > 0;
            return false;
          });
        }
        return false;
      });
      return hasData ? 'in-progress' : 'not-started';
    }

    return 'not-started';
  };

  const StatusIcon = ({ status }: { status: ReturnType<typeof getStepStatus> }) => {
    if (status === 'completed') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (status === 'in-progress') {
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const LinkButton = ({ url }: { url: string }) => {
    if (!url || !url.trim()) return null;

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open(url, '_blank')}
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          {t('open')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => copyToClipboard(url)}
        >
          <Copy className="w-3 h-3 mr-1" />
          {t('copy')}
        </Button>
      </div>
    );
  };

  const FieldDisplay = ({ label, value, link }: { label: string; value?: string; link?: string }) => {
    const hasValue = value && value.trim().length > 0;
    const hasLink = link && link.trim().length > 0;

    if (!hasValue && !hasLink) {
      return (
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-red-500">✗</span>
          <span>{label}: {t('notFilled')}</span>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span className="font-medium">{label}:</span>
          {value && <span className="text-gray-700">{value}</span>}
        </div>
        {hasLink && (
          <div className="ml-6">
            <LinkButton url={link} />
          </div>
        )}
      </div>
    );
  };

  if (loading || !production) {
    return <LoadingOverlay isLoading={true} message={tCommon('loading')} />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <LoadingOverlay isLoading={isSavingTitle} message="Saving..." />
      <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1 max-w-3xl">
                <Input
                  value={production.title}
                  onChange={(e) => setProduction({ ...production, title: e.target.value })}
                  onBlur={() => updateTitle(production.title)}
                  disabled={isSavingTitle}
                  className="text-5xl font-bold border-0 border-b-4 border-transparent hover:border-gray-300 focus:border-blue-500 px-0 rounded-none h-auto py-2 shadow-none focus-visible:ring-0 bg-transparent mb-4"
                  placeholder={t('titlePlaceholder')}
                />
                <div className="flex gap-6 text-sm text-gray-600">
                  <span>{t('created')}: {formatDate(production.createdAt)}</span>
                  <span>{t('updated')}: {formatDate(production.updatedAt)}</span>
                  <span className="font-semibold text-blue-600">
                    {t('completion')}: {production.completionPercentage}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/productions/${productionId}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('editForm')}
                </Button>
                <Button variant="outline">
                  <FileDown className="w-4 h-4 mr-2" />
                  {t('exportPDF')}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Step 1: Contract */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step1_contract)} />
                <CardTitle>{tStep('step1')}</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/productions/${productionId}?step=step1`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <FieldDisplay
              label="Contract"
              link={production.step1_contract.link}
            />
            <FieldDisplay
              label="Notes"
              value={production.step1_contract.notes}
            />
          </CardContent>
        </Card>

        {/* Step 2: Cities */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step2_cities)} />
                <CardTitle>{tStep('step2')}</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/productions/${productionId}?step=step2`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {production.step2_cities.length === 0 ? (
              <div className="text-gray-500">
                <span className="text-red-500">✗</span> No cities added yet
              </div>
            ) : (
              <div className="space-y-4">
                <div className="font-medium">
                  <span className="text-green-600">✓</span> Cities (
                  {production.step2_cities.length} total):
                </div>
                {production.step2_cities.map((city, index) => (
                  <div key={city.id} className="ml-6 p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold mb-2">
                      {index + 1}. {city.city || 'Unnamed City'}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>Date: {city.date || 'Not set'}</div>
                      <div>Time: {city.time || 'Not set'}</div>
                      {city.notes && <div>Notes: {city.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Venue Contracts */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step3_venueContracts)} />
                <CardTitle>{tStep('step3')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step3`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {production.step3_venueContracts.length === 0 ? (
              <div className="text-gray-500"><span className="text-red-500">✗</span> No venue contracts added</div>
            ) : (
              <div className="space-y-3">
                {production.step3_venueContracts.map((venue, i) => (
                  <div key={venue.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{i + 1}. {venue.venueName || 'Unnamed Venue'}</div>
                    {venue.contractLink && <div className="mt-2"><LinkButton url={venue.contractLink} /></div>}
                    {venue.notes && <div className="text-sm text-gray-600 mt-1">Notes: {venue.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 4: Itinerary */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step4_itinerary)} />
                <CardTitle>{tStep('step4')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step4`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <FieldDisplay label="Itinerary" link={production.step4_itinerary.link} />
            <FieldDisplay label="Notes" value={production.step4_itinerary.notes} />
          </CardContent>
        </Card>

        {/* Step 5: Materials */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step5_materials)} />
                <CardTitle>{tStep('step5')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step5`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldDisplay label="Past Performance Videos" link={production.step5_materials.videos?.link || ''} />
            <FieldDisplay label="Performer Videos" link={production.step5_materials.performerVideos?.link || ''} />
            <FieldDisplay label="Music Collection" link={production.step5_materials.musicCollection?.link || ''} />
            <FieldDisplay label="Performance Scene Photos" link={production.step5_materials.photos?.link || ''} />
            <FieldDisplay label="Performer Photos" link={production.step5_materials.actorPhotos?.link || ''} />
            <FieldDisplay label="Other Photos" link={production.step5_materials.otherPhotos?.link || ''} />
            <FieldDisplay label="Logos" link={production.step5_materials.logos?.link || ''} />
            <FieldDisplay label="Text Folder" link={production.step5_materials.texts?.link || ''} />
          </CardContent>
        </Card>

        {/* Step 6: Venue Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step6_venueInfo)} />
                <CardTitle>{tStep('step6')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step6`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {production.step6_venueInfo.length === 0 ? (
              <div className="text-gray-500"><span className="text-red-500">✗</span> No venue info added</div>
            ) : (
              <div className="space-y-3">
                {production.step6_venueInfo.map((venue, i) => (
                  <div key={venue.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{i + 1}. {venue.venueName || 'Unnamed Venue'}</div>
                    <div className="text-sm text-gray-600">{venue.address || 'No address'}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 7: Designs */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step7_designs)} />
                <CardTitle>{tStep('step7')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step7`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <FieldDisplay label="Backdrop Source" link={production.step7_designs.backdrop.sourceFile} />
            <FieldDisplay label="Rollup Banner Source" link={production.step7_designs.rollupBanner.sourceFile} />
          </CardContent>
        </Card>

        {/* Step 8: Promotional Images */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step8_promotionalImages)} />
                <CardTitle>{tStep('step8')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step8`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className={production.step8_promotionalImages.poster16_9.length > 0 ? "text-green-600" : "text-red-500"}>
              {production.step8_promotionalImages.poster16_9.length > 0 ? "✓" : "✗"}</span> 16:9 Posters: {production.step8_promotionalImages.poster16_9.length}</div>
            <div><span className={production.step8_promotionalImages.poster1_1.length > 0 ? "text-green-600" : "text-red-500"}>
              {production.step8_promotionalImages.poster1_1.length > 0 ? "✓" : "✗"}</span> 1:1 Posters: {production.step8_promotionalImages.poster1_1.length}</div>
            <div><span className={production.step8_promotionalImages.poster9_16.length > 0 ? "text-green-600" : "text-red-500"}>
              {production.step8_promotionalImages.poster9_16.length > 0 ? "✓" : "✗"}</span> 9:16 Posters: {production.step8_promotionalImages.poster9_16.length}</div>
          </CardContent>
        </Card>

        {/* Step 9: Videos */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step9_videos)} />
                <CardTitle>{tStep('step9')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step9`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <FieldDisplay label="Conference Loop" link={production.step9_videos.conferenceLoop.link} />
            <FieldDisplay label="Main Promo" link={production.step9_videos.mainPromo.link} />
            <FieldDisplay label="Actor Intro" link={production.step9_videos.actorIntro.link} />
          </CardContent>
        </Card>

        {/* Step 10: Press Conference */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step10_pressConference)} />
                <CardTitle>{tStep('step10')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step10`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <FieldDisplay label="Date/Time" value={production.step10_pressConference.venue.datetime} />
            <FieldDisplay label="Location" value={production.step10_pressConference.venue.location} />
            <FieldDisplay label="Invitation" link={production.step10_pressConference.invitation.link} />
          </CardContent>
        </Card>

        {/* Step 11: Performance Shooting */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step11_performanceShooting)} />
                <CardTitle>{tStep('step11')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step11`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <FieldDisplay label="Google Drive" link={production.step11_performanceShooting.googleDriveLink} />
            <FieldDisplay label="Notes" value={production.step11_performanceShooting.notes} />
          </CardContent>
        </Card>

        {/* Step 12: Social Media */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step12_socialMedia)} />
                <CardTitle>{tStep('step12')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step12`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div><span className={production.step12_socialMedia.websiteUpdated.isAdded ? "text-green-600" : "text-red-500"}>
              {production.step12_socialMedia.websiteUpdated.isAdded ? "✓" : "✗"}</span> Website Updated</div>
            <div><span className={production.step12_socialMedia.platforms.length > 0 ? "text-green-600" : "text-red-500"}>
              {production.step12_socialMedia.platforms.length > 0 ? "✓" : "✗"}</span> Platforms: {production.step12_socialMedia.platforms.length}</div>
            <FieldDisplay label="Facebook Event" link={production.step12_socialMedia.facebookEvent.link} />
          </CardContent>
        </Card>

        {/* Step 13: Advertising */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step13_advertising)} />
                <CardTitle>{tStep('step13')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step13`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="font-medium mb-2">
                  <span className={production.step13_advertising.online.length > 0 ? "text-green-600" : "text-red-500"}>
                    {production.step13_advertising.online.length > 0 ? "✓" : "✗"}
                  </span> Online Advertising ({production.step13_advertising.online.length})
                </div>
                {production.step13_advertising.online.map((item, i) => (
                  <div key={item.id} className="ml-6 p-2 bg-gray-50 rounded mb-2">
                    <div className="font-medium">{item.platformName || 'Unnamed Platform'}</div>
                    <div className="text-sm text-gray-600">
                      Target: {item.targetAudience.join(', ') || 'Not set'}
                    </div>
                    {item.resourceLink && <div className="mt-1"><LinkButton url={item.resourceLink} /></div>}
                  </div>
                ))}
              </div>
              <div>
                <div className="font-medium mb-2">
                  <span className={production.step13_advertising.offline.length > 0 ? "text-green-600" : "text-red-500"}>
                    {production.step13_advertising.offline.length > 0 ? "✓" : "✗"}
                  </span> Offline Collaboration ({production.step13_advertising.offline.length})
                </div>
                {production.step13_advertising.offline.map((item, i) => (
                  <div key={item.id} className="ml-6 p-2 bg-gray-50 rounded mb-2">
                    <div className="font-medium">{item.organizationName || 'Unnamed Organization'}</div>
                    <div className="text-sm text-gray-600">
                      Target: {item.targetAudience.join(', ') || 'Not set'}
                    </div>
                    {item.googleResourceLink && <div className="mt-1"><LinkButton url={item.googleResourceLink} /></div>}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 14: Sponsorship Packages */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step14_sponsorshipPackages)} />
                <CardTitle>{tStep('step14')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step14`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(!production.step14_sponsorshipPackages || production.step14_sponsorshipPackages.length === 0) ? (
              <div className="text-gray-500"><span className="text-red-500">✗</span> No sponsorship packages added</div>
            ) : (
              <div className="space-y-3">
                {production.step14_sponsorshipPackages.map((pkg, i) => (
                  <div key={pkg.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{i + 1}. {pkg.name || 'Unnamed Package'}</div>
                    {pkg.planDetail && <div className="text-sm text-gray-600 mt-1">{pkg.planDetail}</div>}
                    {pkg.fileLink && <div className="mt-2"><LinkButton url={pkg.fileLink} /></div>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 15: Community Alliances */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step15_communityAlliances)} />
                <CardTitle>{tStep('step15')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step15`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(!production.step15_communityAlliances || production.step15_communityAlliances.length === 0) ? (
              <div className="text-gray-500"><span className="text-red-500">✗</span> No community alliances added</div>
            ) : (
              <div className="space-y-3">
                {production.step15_communityAlliances.map((alliance, i) => (
                  <div key={alliance.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{i + 1}. {alliance.communityName || 'Unnamed Community'}</div>
                    {alliance.allianceDetail && <div className="text-sm text-gray-600 mt-1">{alliance.allianceDetail}</div>}
                    {alliance.files && <div className="mt-2"><LinkButton url={alliance.files} /></div>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
}
