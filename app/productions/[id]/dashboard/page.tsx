'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import {
  Edit,
  ExternalLink,
} from 'lucide-react';
import LoadingOverlay from '@/components/LoadingOverlay';
import type { Production } from '@/types/production';

export default function ProductionDashboard() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations('production');
  const tCommon = useTranslations('common');
  const tStep = useTranslations('stepConfig');
  const productionId = params?.id as string;
  const [production, setProduction] = useState<Production | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getMediaItemLink = (item: { mediaPackageLinks?: Record<string, string> }) => {
    if (!item?.mediaPackageLinks) return '';
    return Object.values(item.mediaPackageLinks).find((link) => link && link.trim()) || '';
  };

  const LinkButton = ({ url }: { url: string }) => {
    if (!url || !url.trim()) return null;

    return (
      <a
        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        <ExternalLink className="w-3 h-3" />
        {t('open')}
      </a>
    );
  };

  const FieldDisplay = ({ label, value, link }: { label: string; value?: string; link?: string }) => {
    const hasValue = value && value.trim().length > 0;
    const hasLink = link && link.trim().length > 0;

    if (!hasValue && !hasLink) {
      return (
        <div className="grid grid-cols-[140px_1fr] gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-600">{label}</span>
          <span>{t('notFilled')}</span>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-[140px_1fr_auto] gap-2 text-xs text-gray-700">
        <span className="font-medium text-gray-600">{label}</span>
        <span className="break-words">{value || ''}</span>
        <span>{hasLink ? <LinkButton url={link} /> : null}</span>
      </div>
    );
  };

  if (loading || !production) {
    return <LoadingOverlay isLoading={true} message={tCommon('loading')} />;
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card className="border border-slate-200/70 shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="space-y-2">{children}</div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="text-xl font-semibold text-slate-900">
                {production.title || t('titlePlaceholder')}
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span>{t('created')}: {formatDate(production.createdAt)}</span>
                <span>{t('updated')}: {formatDate(production.updatedAt)}</span>
                <span className="font-semibold text-blue-600">
                  {t('completion')}: {production.completionPercentage || 0}%
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => router.push('/productions')}>
                Back to Productions
              </Button>
              <Button onClick={() => router.push(`/productions/${productionId}`)}>
                <Edit className="w-4 h-4 mr-2" />
                {t('editForm')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <SectionCard title={tStep('step1')}>
              <FieldDisplay label="Contract" link={production.step1_contract.link} />
              <FieldDisplay label="Notes" value={production.step1_contract.notes} />
            </SectionCard>

            <SectionCard title={tStep('step2')}>
              {production.step2_cities.length === 0 ? (
                <div className="text-xs text-slate-400">No cities added yet</div>
              ) : (
                <div className="space-y-2">
                  {production.step2_cities.map((city, index) => (
                    <div key={city.id} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                      <div className="text-xs font-semibold">{index + 1}. {city.city || 'Unnamed City'}</div>
                      <div className="text-xs text-slate-600">Date: {city.date || 'Not set'}</div>
                      <div className="text-xs text-slate-600">Time: {city.time || 'Not set'}</div>
                      {city.notes && <div className="text-xs text-slate-600">Notes: {city.notes}</div>}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title={tStep('step3')}>
              {production.step3_venueContracts.length === 0 ? (
                <div className="text-xs text-slate-400">No venue contracts added</div>
              ) : (
                <div className="space-y-2">
                  {production.step3_venueContracts.map((venue, index) => (
                    <div key={venue.id} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                      <div className="text-xs font-semibold">{index + 1}. {venue.venueName || 'Unnamed Venue'}</div>
                      {venue.contractLink && <LinkButton url={venue.contractLink} />}
                      {venue.notes && <div className="text-xs text-slate-600">Notes: {venue.notes}</div>}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title={tStep('step4')}>
              <FieldDisplay label="Itinerary" link={production.step4_itinerary.link} />
              <FieldDisplay label="Notes" value={production.step4_itinerary.notes} />
            </SectionCard>

            <SectionCard title={tStep('step5')}>
              <FieldDisplay label="Past Performance Videos" link={production.step5_materials.videos?.link || ''} />
              <FieldDisplay label="Performer Videos" link={production.step5_materials.performerVideos?.link || ''} />
              <FieldDisplay label="Music Collection" link={production.step5_materials.musicCollection?.link || ''} />
              <FieldDisplay label="Performance Scene Photos" link={production.step5_materials.photos?.link || ''} />
              <FieldDisplay label="Performer Photos" link={production.step5_materials.actorPhotos?.link || ''} />
              <FieldDisplay label="Other Photos" link={production.step5_materials.otherPhotos?.link || ''} />
              <FieldDisplay label="Logos" link={production.step5_materials.logos?.link || ''} />
              <FieldDisplay label="Text Folder" link={production.step5_materials.texts?.link || ''} />
            </SectionCard>

            <SectionCard title={tStep('step6')}>
              {production.step6_venueInfo.length === 0 ? (
                <div className="text-xs text-slate-400">No venue info added</div>
              ) : (
                <div className="space-y-2">
                  {production.step6_venueInfo.map((venue, index) => {
                    const linkedCity = production.step2_cities.find((city) => city.id === venue.linkedCityId);
                    return (
                      <div key={venue.id} className="rounded-md border border-slate-200 bg-slate-50 p-2 space-y-1">
                        <div className="text-xs font-semibold">{index + 1}. {venue.venueName || 'Unnamed Venue'}</div>
                        {linkedCity && (
                          <div className="text-xs text-slate-600">
                            {linkedCity.city}{linkedCity.date ? ` • ${linkedCity.date}` : ''}{linkedCity.time ? ` ${linkedCity.time}` : ''}
                          </div>
                        )}
                        <div className="text-xs text-slate-600">{venue.address || 'No address'}</div>
                        {venue.contacts && <div className="text-xs text-slate-600 whitespace-pre-line">{venue.contacts}</div>}
                        {venue.otherInfo && <div className="text-xs text-slate-600 whitespace-pre-line">{venue.otherInfo}</div>}
                        {venue.previewImage && <LinkButton url={venue.previewImage} />}
                        {venue.requiredForms?.link && <LinkButton url={venue.requiredForms.link} />}
                        {venue.ticketDesign?.link && <LinkButton url={venue.ticketDesign.link} />}
                        {venue.ticketDesign?.pricing && <div className="text-xs text-slate-600">Pricing: {venue.ticketDesign.pricing}</div>}
                        {venue.seatMap?.link && <LinkButton url={venue.seatMap.link} />}
                        {venue.ticketLink?.link && <LinkButton url={venue.ticketLink.link} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            <SectionCard title={tStep('step7')}>
              {production.step7_designs.media?.length === 0 ? (
                <div className="text-xs text-slate-400">No media items added</div>
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
            </SectionCard>

            <SectionCard title={tStep('step16')}>
              {production.step16_venueMediaDesign.media?.length === 0 ? (
                <div className="text-xs text-slate-400">No media items added</div>
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
            </SectionCard>

            <SectionCard title={tStep('step8')}>
              {production.step8_promotionalImages.media?.length === 0 ? (
                <div className="text-xs text-slate-400">No media items added</div>
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
            </SectionCard>

            <SectionCard title={tStep('step9')}>
              {production.step9_videos.media?.length === 0 ? (
                <div className="text-xs text-slate-400">No media items added</div>
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
            </SectionCard>

            <SectionCard title={tStep('step10')}>
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
            </SectionCard>

            <SectionCard title={tStep('step11')}>
              <FieldDisplay label="Google Drive" link={production.step11_performanceShooting.googleDriveLink} />
              <FieldDisplay label="Notes" value={production.step11_performanceShooting.notes} />
            </SectionCard>

            <SectionCard title={tStep('step12')}>
              <FieldDisplay label="Strategy Link" link={production.step12_socialMedia.strategyLink?.link || ''} />
              {production.step12_socialMedia.promotions?.length === 0 ? (
                <div className="text-xs text-slate-400">No promotions added</div>
              ) : (
                <div className="space-y-2">
                  {production.step12_socialMedia.promotions?.map((promo, index) => (
                    <div key={promo.id} className="rounded-md border border-slate-200 bg-slate-50 p-2 space-y-1">
                      <div className="text-xs font-semibold">{promo.title || `Promotion ${index + 1}`}</div>
                      {promo.description && <div className="text-xs text-slate-600">{promo.description}</div>}
                      {promo.mediaFiles?.length > 0 && (
                        <div className="space-y-1">
                          {promo.mediaFiles.map((file) => (
                            <FieldDisplay key={file.id} label={file.name || 'Media File'} link={file.link} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title={tStep('step13')}>
              <FieldDisplay label="Event Summary" link={production.step13_afterEvent.eventSummary.link} />
              <FieldDisplay label="Event Retrospective" link={production.step13_afterEvent.eventRetrospective.link} />
            </SectionCard>

            <SectionCard title={tStep('step14')}>
              {(!production.step14_sponsorshipPackages || production.step14_sponsorshipPackages.length === 0) ? (
                <div className="text-xs text-slate-400">No sponsorship packages added</div>
              ) : (
                <div className="space-y-2">
                  {production.step14_sponsorshipPackages.map((pkg, index) => (
                    <div key={pkg.id} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                      <div className="text-xs font-semibold">{index + 1}. {pkg.name || 'Unnamed Package'}</div>
                      {pkg.planDetail && <div className="text-xs text-slate-600">{pkg.planDetail}</div>}
                      {pkg.fileLink && <LinkButton url={pkg.fileLink} />}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title={tStep('step15')}>
              {(!production.step15_communityAlliances || production.step15_communityAlliances.length === 0) ? (
                <div className="text-xs text-slate-400">No community alliances added</div>
              ) : (
                <div className="space-y-2">
                  {production.step15_communityAlliances.map((alliance, index) => (
                    <div key={alliance.id} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                      <div className="text-xs font-semibold">{index + 1}. {alliance.communityName || 'Unnamed Community'}</div>
                      {alliance.allianceDetail && <div className="text-xs text-slate-600">{alliance.allianceDetail}</div>}
                      {alliance.files && <LinkButton url={alliance.files} />}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title={tStep('step17')}>
              {production.step17_meetups.length === 0 ? (
                <div className="text-xs text-slate-400">No meet-ups added</div>
              ) : (
                <div className="space-y-2">
                  {production.step17_meetups.map((meetup, index) => (
                    <div key={meetup.id} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                      <div className="text-xs font-semibold">{index + 1}. {meetup.title || 'Untitled Meet-up'}</div>
                      {meetup.datetime && <div className="text-xs text-slate-600">{meetup.datetime}</div>}
                      {meetup.location && <div className="text-xs text-slate-600">{meetup.location}</div>}
                      {meetup.description && <div className="text-xs text-slate-600">{meetup.description}</div>}
                      {meetup.notes && <div className="text-xs text-slate-600">Notes: {meetup.notes}</div>}
                      {meetup.fileLink && <LinkButton url={meetup.fileLink} />}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  );
}
