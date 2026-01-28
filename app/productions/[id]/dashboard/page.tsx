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
        const normalized = {
          ...data,
          step12_socialMedia: {
            strategyLink: data.step12_socialMedia?.strategyLink || { link: '', notes: '' },
            promotions: data.step12_socialMedia?.promotions || [],
          },
          step10_pressConference: {
            ...data.step10_pressConference,
            location: data.step10_pressConference?.location || '',
            invitationLetter: data.step10_pressConference?.invitationLetter || { link: '', notes: '' },
            guestList: data.step10_pressConference?.guestList || { link: '', notes: '' },
            pressRelease: data.step10_pressConference?.pressRelease || { link: '', notes: '' },
            media: data.step10_pressConference?.media || [],
          },
          step13_afterEvent: {
            ...data.step13_afterEvent,
            eventSummary: data.step13_afterEvent?.eventSummary || { link: '', notes: '' },
            eventRetrospective: data.step13_afterEvent?.eventRetrospective || { link: '', notes: '' },
          },
          step16_venueMediaDesign: data.step16_venueMediaDesign || { media: [] },
          step17_meetups: data.step17_meetups || [],
        };
        setProduction(normalized);
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

  const getMediaItemLink = (item: { mediaPackageLinks?: Record<string, string> }) => {
    if (!item?.mediaPackageLinks) return '';
    return Object.values(item.mediaPackageLinks).find((link) => link && link.trim()) || '';
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

  const buildExportHtml = (prod: Production) => {
    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const toText = (value?: string) => (value ? escapeHtml(value).replace(/\n/g, '<br/>') : '');
    const toLink = (value?: string) =>
      value && value.trim()
        ? `<a class="link" href="${escapeHtml(value)}" target="_blank" rel="noreferrer">Open</a>`
        : '';

    const row = (label: string, value?: string, link?: string) => {
      const hasValue = value && value.trim();
      const hasLink = link && link.trim();
      if (!hasValue && !hasLink) {
        return `<div class="row empty"><div class="label">${escapeHtml(label)}</div><div class="value muted">${escapeHtml(t('notFilled'))}</div></div>`;
      }
      return `<div class="row"><div class="label">${escapeHtml(label)}</div><div class="value">${hasValue ? toText(value) : ''}</div>${hasLink ? `<div class="actions">${toLink(link)}</div>` : '<div class="actions"></div>'}</div>`;
    };

    const section = (title: string, body: string) =>
      `<section class="section"><div class="section-title">${escapeHtml(title)}</div>${body}</section>`;

    const renderLinksMap = (links?: Record<string, string>) => {
      if (!links) return '';
      const items = Object.values(links).filter((link) => link && link.trim());
      if (items.length === 0) return '';
      return `<div class="sublist">${items
        .map((link) => `<div class="row compact"><div class="label">Media Files</div><div class="value"></div><div class="actions">${toLink(link)}</div></div>`)
        .join('')}</div>`;
    };

    const renderMediaItems = (items?: { title?: string; description?: string; mediaPackageLinks?: Record<string, string> }[]) => {
      if (!items || items.length === 0) {
        return `<div class="muted">${escapeHtml(t('notFilled'))}</div>`;
      }
      return items
        .map((item, index) => {
          const title = item.title?.trim() || `Media ${index + 1}`;
          return `<div class="subcard">
            <div class="subcard-title">${escapeHtml(title)}</div>
            ${item.description ? `<div class="subcard-desc">${toText(item.description)}</div>` : ''}
            ${renderLinksMap(item.mediaPackageLinks)}
          </div>`;
        })
        .join('');
    };

    const citiesBody =
      prod.step2_cities.length === 0
        ? `<div class="muted">No cities added yet</div>`
        : prod.step2_cities
            .map((city, index) => `
              <div class="subcard">
                <div class="subcard-title">${escapeHtml(`${index + 1}. ${city.city || 'Unnamed City'}`)}</div>
                <div class="subcard-desc">${escapeHtml(`Date: ${city.date || 'Not set'} • Time: ${city.time || 'Not set'}`)}</div>
                ${city.notes ? `<div class="subcard-desc">${toText(`Notes: ${city.notes}`)}</div>` : ''}
              </div>
            `)
            .join('');

    const venueContractsBody =
      prod.step3_venueContracts.length === 0
        ? `<div class="muted">No venue contracts added</div>`
        : prod.step3_venueContracts
            .map((venue, index) => `
              <div class="subcard">
                <div class="subcard-title">${escapeHtml(`${index + 1}. ${venue.venueName || 'Unnamed Venue'}`)}</div>
                ${venue.notes ? `<div class="subcard-desc">${toText(venue.notes)}</div>` : ''}
                ${venue.contractLink ? `<div class="row compact"><div class="label">Contract</div><div class="value"></div><div class="actions">${toLink(venue.contractLink)}</div></div>` : ''}
              </div>
            `)
            .join('');

    const venueInfoBody =
      prod.step6_venueInfo.length === 0
        ? `<div class="muted">No venue info added</div>`
        : prod.step6_venueInfo
            .map((venue, index) => {
              const city = prod.step2_cities.find((c) => c.id === venue.linkedCityId);
              const cityLine = city
                ? `${city.city || 'City'}${city.date ? ` • ${city.date}` : ''}${city.time ? ` ${city.time}` : ''}`
                : '';
              return `
                <div class="subcard">
                  <div class="subcard-title">${escapeHtml(`${index + 1}. ${venue.venueName || 'Unnamed Venue'}`)}</div>
                  ${cityLine ? `<div class="subcard-desc">${escapeHtml(cityLine)}</div>` : ''}
                  <div class="subcard-desc">${escapeHtml(venue.address || 'No address')}</div>
                  ${venue.contacts ? `<div class="subcard-desc">${toText(venue.contacts)}</div>` : ''}
                  ${venue.otherInfo ? `<div class="subcard-desc">${toText(venue.otherInfo)}</div>` : ''}
                  ${venue.previewImage ? `<div class="row compact"><div class="label">Preview Image</div><div class="value"></div><div class="actions">${toLink(venue.previewImage)}</div></div>` : ''}
                  ${venue.requiredForms?.link ? `<div class="row compact"><div class="label">Forms Link</div><div class="value"></div><div class="actions">${toLink(venue.requiredForms.link)}</div></div>` : ''}
                  ${venue.ticketDesign?.link ? `<div class="row compact"><div class="label">Ticket Design</div><div class="value"></div><div class="actions">${toLink(venue.ticketDesign.link)}</div></div>` : ''}
                  ${venue.ticketDesign?.pricing ? `<div class="subcard-desc">${toText(`Pricing: ${venue.ticketDesign.pricing}`)}</div>` : ''}
                  ${venue.seatMap?.link ? `<div class="row compact"><div class="label">Seat Map</div><div class="value"></div><div class="actions">${toLink(venue.seatMap.link)}</div></div>` : ''}
                  ${venue.ticketLink?.link ? `<div class="row compact"><div class="label">Ticket Link</div><div class="value"></div><div class="actions">${toLink(venue.ticketLink.link)}</div></div>` : ''}
                </div>
              `;
            })
            .join('');

    const sponsorshipBody =
      !prod.step14_sponsorshipPackages || prod.step14_sponsorshipPackages.length === 0
        ? `<div class="muted">No sponsorship packages added</div>`
        : prod.step14_sponsorshipPackages
            .map((pkg, index) => `
              <div class="subcard">
                <div class="subcard-title">${escapeHtml(`${index + 1}. ${pkg.name || 'Unnamed Package'}`)}</div>
                ${pkg.planDetail ? `<div class="subcard-desc">${toText(pkg.planDetail)}</div>` : ''}
                ${pkg.fileLink ? `<div class="row compact"><div class="label">File</div><div class="value"></div><div class="actions">${toLink(pkg.fileLink)}</div></div>` : ''}
              </div>
            `)
            .join('');

    const alliancesBody =
      !prod.step15_communityAlliances || prod.step15_communityAlliances.length === 0
        ? `<div class="muted">No community alliances added</div>`
        : prod.step15_communityAlliances
            .map((alliance, index) => `
              <div class="subcard">
                <div class="subcard-title">${escapeHtml(`${index + 1}. ${alliance.communityName || 'Unnamed Community'}`)}</div>
                ${alliance.allianceDetail ? `<div class="subcard-desc">${toText(alliance.allianceDetail)}</div>` : ''}
                ${alliance.files ? `<div class="row compact"><div class="label">Files</div><div class="value"></div><div class="actions">${toLink(alliance.files)}</div></div>` : ''}
              </div>
            `)
            .join('');

    const meetupsBody =
      prod.step17_meetups.length === 0
        ? `<div class="muted">No meet-ups added</div>`
        : prod.step17_meetups
            .map((meetup, index) => `
              <div class="subcard">
                <div class="subcard-title">${escapeHtml(`${index + 1}. ${meetup.title || 'Untitled Meet-up'}`)}</div>
                <div class="subcard-desc">${escapeHtml([meetup.datetime, meetup.location].filter(Boolean).join(' • ') || 'No details')}</div>
                ${meetup.description ? `<div class="subcard-desc">${toText(meetup.description)}</div>` : ''}
                ${meetup.notes ? `<div class="subcard-desc">${toText(`Notes: ${meetup.notes}`)}</div>` : ''}
                ${meetup.fileLink ? `<div class="row compact"><div class="label">File</div><div class="value"></div><div class="actions">${toLink(meetup.fileLink)}</div></div>` : ''}
              </div>
            `)
            .join('');

    const promotionsBody =
      prod.step12_socialMedia.promotions?.length === 0
        ? `<div class="muted">No promotions added</div>`
        : prod.step12_socialMedia.promotions
            .map((promo, index) => `
              <div class="subcard">
                <div class="subcard-title">${escapeHtml(promo.title || `Promotion ${index + 1}`)}</div>
                ${promo.description ? `<div class="subcard-desc">${toText(promo.description)}</div>` : ''}
                ${
                  promo.mediaFiles?.length
                    ? promo.mediaFiles
                        .map((file) =>
                          `<div class="row compact"><div class="label">${escapeHtml(file.name || 'Media File')}</div><div class="value"></div><div class="actions">${toLink(file.link)}</div></div>`
                        )
                        .join('')
                    : ''
                }
              </div>
            `)
            .join('');

    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(prod.title || t('titlePlaceholder'))}</title>
    <style>
      :root { color-scheme: light; }
      body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
      .header { margin-bottom: 16px; }
      .title { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
      .meta { font-size: 12px; color: #475569; display: flex; gap: 12px; flex-wrap: wrap; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
      .section { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05); }
      .section-title { font-size: 14px; font-weight: 700; margin-bottom: 8px; color: #0f172a; }
      .row { display: grid; grid-template-columns: 140px 1fr auto; gap: 8px; padding: 4px 0; border-bottom: 1px dashed #e2e8f0; }
      .row:last-child { border-bottom: none; }
      .row.compact { grid-template-columns: 140px 1fr auto; }
      .label { font-size: 12px; font-weight: 600; color: #334155; }
      .value { font-size: 12px; color: #0f172a; }
      .actions { font-size: 12px; }
      .link { color: #2563eb; text-decoration: none; font-weight: 600; }
      .muted { font-size: 12px; color: #94a3b8; }
      .subcard { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; margin-bottom: 8px; }
      .subcard:last-child { margin-bottom: 0; }
      .subcard-title { font-size: 12px; font-weight: 700; margin-bottom: 4px; }
      .subcard-desc { font-size: 12px; color: #475569; margin-bottom: 4px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="title">${escapeHtml(prod.title || t('titlePlaceholder'))}</div>
      <div class="meta">
        <div>${escapeHtml(`${t('created')}: ${formatDate(prod.createdAt)}`)}</div>
        <div>${escapeHtml(`${t('updated')}: ${formatDate(prod.updatedAt)}`)}</div>
        <div>${escapeHtml(`${t('completion')}: ${prod.completionPercentage || 0}%`)}</div>
      </div>
    </div>
    <div class="grid">
      ${section(tStep('step1'), row('Contract', undefined, prod.step1_contract.link) + row('Notes', prod.step1_contract.notes))}
      ${section(tStep('step2'), citiesBody)}
      ${section(tStep('step3'), venueContractsBody)}
      ${section(tStep('step4'), row('Itinerary', undefined, prod.step4_itinerary.link) + row('Notes', prod.step4_itinerary.notes))}
      ${section(tStep('step5'), [
        row('Past Performance Videos', undefined, prod.step5_materials.videos?.link || ''),
        row('Performer Videos', undefined, prod.step5_materials.performerVideos?.link || ''),
        row('Music Collection', undefined, prod.step5_materials.musicCollection?.link || ''),
        row('Performance Scene Photos', undefined, prod.step5_materials.photos?.link || ''),
        row('Performer Photos', undefined, prod.step5_materials.actorPhotos?.link || ''),
        row('Other Photos', undefined, prod.step5_materials.otherPhotos?.link || ''),
        row('Logos', undefined, prod.step5_materials.logos?.link || ''),
        row('Text Folder', undefined, prod.step5_materials.texts?.link || ''),
      ].join(''))}
      ${section(tStep('step6'), venueInfoBody)}
      ${section(tStep('step7'), renderMediaItems(prod.step7_designs.media))}
      ${section(tStep('step16'), renderMediaItems(prod.step16_venueMediaDesign.media))}
      ${section(tStep('step8'), renderMediaItems(prod.step8_promotionalImages.media))}
      ${section(tStep('step9'), renderMediaItems(prod.step9_videos.media))}
      ${section(tStep('step10'), [
        row('Press Conference Location', prod.step10_pressConference.location),
        row('Invitation Letter', undefined, prod.step10_pressConference.invitationLetter.link),
        row('Guest List', undefined, prod.step10_pressConference.guestList.link),
        row('Official Press Release', undefined, prod.step10_pressConference.pressRelease.link),
        prod.step10_pressConference.media?.length ? renderMediaItems(prod.step10_pressConference.media) : '',
      ].join(''))}
      ${section(tStep('step11'), row('Google Drive', undefined, prod.step11_performanceShooting.googleDriveLink) + row('Notes', prod.step11_performanceShooting.notes))}
      ${section(tStep('step12'), row('Strategy Link', undefined, prod.step12_socialMedia.strategyLink?.link || '') + promotionsBody)}
      ${section(tStep('step13'), row('Event Summary', undefined, prod.step13_afterEvent.eventSummary.link) + row('Event Retrospective', undefined, prod.step13_afterEvent.eventRetrospective.link))}
      ${section(tStep('step14'), sponsorshipBody)}
      ${section(tStep('step15'), alliancesBody)}
      ${section(tStep('step17'), meetupsBody)}
    </div>
  </body>
</html>`;
  };

  const handleExportHtml = () => {
    if (!production) return;
    const exportWindow = window.open('', '_blank');
    if (!exportWindow) return;
    exportWindow.document.open();
    exportWindow.document.write(buildExportHtml(production));
    exportWindow.document.close();
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
                <Button variant="outline" onClick={handleExportHtml}>
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
                {production.step6_venueInfo.map((venue, i) => {
                  const linkedCity = production.step2_cities.find((city) => city.id === venue.linkedCityId);
                  return (
                    <div key={venue.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="font-semibold">{i + 1}. {venue.venueName || 'Unnamed Venue'}</div>
                      {linkedCity && (
                        <div className="text-sm text-gray-600">
                          {linkedCity.city}{linkedCity.date ? ` • ${linkedCity.date}` : ''}{linkedCity.time ? ` ${linkedCity.time}` : ''}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">{venue.address || 'No address'}</div>
                      {venue.contacts && (
                        <div className="text-sm text-gray-700 whitespace-pre-line">{venue.contacts}</div>
                      )}
                      {venue.otherInfo && (
                        <div className="text-sm text-gray-700 whitespace-pre-line">{venue.otherInfo}</div>
                      )}
                      {venue.previewImage && (
                        <div className="mt-2">
                          <LinkButton url={venue.previewImage} />
                        </div>
                      )}
                      {venue.requiredForms?.link && (
                        <div className="mt-1">
                          <LinkButton url={venue.requiredForms.link} />
                        </div>
                      )}
                      {venue.ticketDesign?.link && (
                        <div className="mt-1">
                          <LinkButton url={venue.ticketDesign.link} />
                        </div>
                      )}
                      {venue.ticketDesign?.pricing && (
                        <div className="text-sm text-gray-600">Pricing: {venue.ticketDesign.pricing}</div>
                      )}
                      {venue.seatMap?.link && (
                        <div className="mt-1">
                          <LinkButton url={venue.seatMap.link} />
                        </div>
                      )}
                      {venue.ticketLink?.link && (
                        <div className="mt-1">
                          <LinkButton url={venue.ticketLink.link} />
                        </div>
                      )}
                    </div>
                  );
                })}
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
            {production.step7_designs.media?.length === 0 ? (
              <div className="text-gray-500"><span className="text-red-500">✗</span> No media items added</div>
            ) : (
              <div className="space-y-2">
                {production.step7_designs.media?.map((item) => (
                  <FieldDisplay
                    key={item.id}
                    label={item.title || 'Media Item'}
                    link={getMediaItemLink(item)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 16: Venue Media Design */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step16_venueMediaDesign)} />
                <CardTitle>{tStep('step16')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step16`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {production.step16_venueMediaDesign.media?.length === 0 ? (
              <div className="text-gray-500"><span className="text-red-500">✗</span> No media items added</div>
            ) : (
              <div className="space-y-2">
                {production.step16_venueMediaDesign.media?.map((item) => (
                  <FieldDisplay
                    key={item.id}
                    label={item.title || 'Media Item'}
                    link={getMediaItemLink(item)}
                  />
                ))}
              </div>
            )}
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
          <CardContent className="space-y-3">
            {production.step8_promotionalImages.media?.length === 0 ? (
              <div className="text-gray-500"><span className="text-red-500">✗</span> No media items added</div>
            ) : (
              <div className="space-y-2">
                {production.step8_promotionalImages.media?.map((item) => (
                  <FieldDisplay
                    key={item.id}
                    label={item.title || 'Media Item'}
                    link={getMediaItemLink(item)}
                  />
                ))}
              </div>
            )}
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
            {production.step9_videos.media?.length === 0 ? (
              <div className="text-gray-500"><span className="text-red-500">✗</span> No media items added</div>
            ) : (
              <div className="space-y-2">
                {production.step9_videos.media?.map((item) => (
                  <FieldDisplay
                    key={item.id}
                    label={item.title || 'Media Item'}
                    link={getMediaItemLink(item)}
                  />
                ))}
              </div>
            )}
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
            <FieldDisplay label="Press Conference Location" value={production.step10_pressConference.location} />
            <FieldDisplay label="Invitation Letter" link={production.step10_pressConference.invitationLetter.link} />
            <FieldDisplay label="Guest List" link={production.step10_pressConference.guestList.link} />
            <FieldDisplay label="Official Press Release" link={production.step10_pressConference.pressRelease.link} />
            {production.step10_pressConference.media?.length > 0 && (
              <div className="space-y-2">
                {production.step10_pressConference.media?.map((item) => (
                  <FieldDisplay
                    key={item.id}
                    label={item.title || 'Media Item'}
                    link={getMediaItemLink(item)}
                  />
                ))}
              </div>
            )}
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

        {/* Step 12: Online Promotion */}
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
            <FieldDisplay label="Strategy Link" link={production.step12_socialMedia.strategyLink?.link || ''} />
            {production.step12_socialMedia.promotions?.length === 0 ? (
              <div className="text-gray-500"><span className="text-red-500">✗</span> No promotions added</div>
            ) : (
              <div className="space-y-2">
                {production.step12_socialMedia.promotions?.map((promo) => (
                  <div key={promo.id} className="rounded-md border bg-gray-50 p-3">
                    <div className="text-sm font-semibold">{promo.title || 'Promotion'}</div>
                    {promo.mediaFiles?.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {promo.mediaFiles.map((file) => (
                          <FieldDisplay key={file.id} label={file.name || 'Media File'} link={file.link} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 13: After Event */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step13_afterEvent)} />
                <CardTitle>{tStep('step13')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step13`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <FieldDisplay label="Event Summary" link={production.step13_afterEvent.eventSummary.link} />
            <FieldDisplay label="Event Retrospective" link={production.step13_afterEvent.eventRetrospective.link} />
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

        {/* Step 17: Meet-ups */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon status={getStepStatus(production.step17_meetups)} />
                <CardTitle>{tStep('step17')}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/productions/${productionId}?step=step17`)}>
                <Edit className="w-4 h-4 mr-2" />{t('edit')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {production.step17_meetups.length === 0 ? (
              <div className="text-gray-500"><span className="text-red-500">✗</span> No meet-ups added</div>
            ) : (
              <div className="space-y-3">
                {production.step17_meetups.map((meetup, i) => (
                  <div key={meetup.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{i + 1}. {meetup.title || 'Untitled Meet-up'}</div>
                    {meetup.datetime && <div className="text-sm text-gray-600">{meetup.datetime}</div>}
                    {meetup.location && <div className="text-sm text-gray-600">{meetup.location}</div>}
                    {meetup.fileLink && <div className="mt-2"><LinkButton url={meetup.fileLink} /></div>}
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
