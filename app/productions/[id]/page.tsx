'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import StepProgress from '@/components/StepProgress';
import Step1Contract from '@/components/production-steps/Step1Contract';
import Step2Cities from '@/components/production-steps/Step2Cities';
import Step3VenueContracts from '@/components/production-steps/Step3VenueContracts';
import Step4Itinerary from '@/components/production-steps/Step4Itinerary';
import Step5Materials from '@/components/production-steps/Step5Materials';
import Step6VenueInfo from '@/components/production-steps/Step6VenueInfo';
import Step7Designs from '@/components/production-steps/Step7Designs';
import Step8PromotionalImages from '@/components/production-steps/Step8PromotionalImages';
import Step9Videos from '@/components/production-steps/Step9Videos';
import Step10PressConference from '@/components/production-steps/Step10PressConference';
import Step11PerformanceShooting from '@/components/production-steps/Step11PerformanceShooting';
import Step12SocialMedia from '@/components/production-steps/Step12SocialMedia';
import Step13AfterEvent from '@/components/production-steps/Step13AfterEvent';
import Step14SponsorshipPackages from '@/components/production-steps/Step14SponsorshipPackages';
import Step15CommunityAlliances from '@/components/production-steps/Step15CommunityAlliances';
import Step16VenueMediaDesign from '@/components/production-steps/Step16VenueMediaDesign';
import Step17Meetups from '@/components/production-steps/Step17Meetups';
import { useGlobalKnowledge } from '@/hooks/useGlobalKnowledge';
import LoadingOverlay from '@/components/LoadingOverlay';
import type { Production } from '@/types/production';
import type { StepConfig } from '@/types/productionStepConfig';
import { calculateCompletionPercentage } from '@/lib/completionCalculator';

export default function ProductionEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('production');
  const productionId = params?.id as string;
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  // Get initial step from URL query parameter, default to step1
  const initialStepKey = searchParams.get('step') || 'step1';
  const [production, setProduction] = useState<Production | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepKey, setCurrentStepKey] = useState(initialStepKey);
  const [stepConfig, setStepConfig] = useState<StepConfig[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Global knowledge hook
  const { getLinkedIds, getLinkedItems, refetch: refetchKnowledge } = useGlobalKnowledge();

  // Fetch production data and step config
  useEffect(() => {
    fetchProduction();
    fetchStepConfig();
  }, [productionId]);

  const fetchStepConfig = async () => {
    try {
      const response = await fetch('/api/production-step-config');
      if (response.ok) {
        const data = await response.json();
        setStepConfig(data.steps || []);
      }
    } catch (error) {
      console.error('Error fetching step config:', error);
    }
  };

  // Get enabled steps in order
  const enabledSteps = stepConfig
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  // Get current step number from step key for rendering
  const getCurrentStepNumber = (stepKey: string): number => {
    const match = stepKey.match(/step(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  const currentStepNumber = getCurrentStepNumber(currentStepKey);

  // Update current step when URL parameter changes
  useEffect(() => {
    const stepKey = searchParams.get('step') || 'step1';
    if (stepKey.match(/^step\d+$/)) {
      setCurrentStepKey(stepKey);
    }
  }, [searchParams]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      saveProduction();
    }, 30000);

    return () => clearTimeout(timer);
  }, [production, hasUnsavedChanges]);

  const fetchProduction = async () => {
    try {
      setLoading(true);
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
      } else {
        alert(t('loadFailed'));
      }
    } catch (error) {
      console.error('Error fetching production:', error);
      alert(t('loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if a string field is empty
  const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (typeof value === 'boolean') return false;
    return false;
  };

  const sanitizeMediaLinks = (mediaItems: Array<{
    id: string;
    title: string;
    description: string;
    mediaPackageIds: string[];
    mediaPackageLinks?: Record<string, string>;
  }>) => {
    return mediaItems.map((item) => {
      const allowedIds = new Set<string>(item.mediaPackageIds);
      const existingLinks = item.mediaPackageLinks || {};
      const nextLinks: Record<string, string> = {};
      allowedIds.forEach((pkgId) => {
        const value = existingLinks[pkgId];
        if (typeof value === 'string') {
          nextLinks[pkgId] = value;
        }
      });
      return { ...item, mediaPackageLinks: nextLinks };
    });
  };

  // Clean empty items from arrays before saving
  const cleanProductionData = (prod: Production): Production => {
    return {
      ...prod,
      step2_cities: prod.step2_cities.filter(city =>
        !isEmpty(city.city) || !isEmpty(city.date) || !isEmpty(city.time)
      ),
      step3_venueContracts: prod.step3_venueContracts.filter(venue =>
        !isEmpty(venue.venueName) || !isEmpty(venue.contractLink)
      ),
      step5_materials: {
        ...prod.step5_materials,
      },
      step6_venueInfo: prod.step6_venueInfo.filter(venue =>
        !isEmpty(venue.venueName) || !isEmpty(venue.address)
      ),
      step7_designs: {
        ...prod.step7_designs,
        media: sanitizeMediaLinks(prod.step7_designs.media || []),
      },
      step8_promotionalImages: {
        ...prod.step8_promotionalImages,
        media: sanitizeMediaLinks(prod.step8_promotionalImages.media || []),
      },
      step9_videos: {
        ...prod.step9_videos,
        media: sanitizeMediaLinks(prod.step9_videos.media || []),
      },
      step10_pressConference: {
        ...prod.step10_pressConference,
        media: sanitizeMediaLinks(prod.step10_pressConference.media || []),
      },
      step16_venueMediaDesign: {
        ...prod.step16_venueMediaDesign,
        media: sanitizeMediaLinks(prod.step16_venueMediaDesign.media || []),
      },
      step17_meetups: (prod.step17_meetups || []).filter((meetup) =>
        !isEmpty(meetup.title) ||
        !isEmpty(meetup.datetime) ||
        !isEmpty(meetup.location) ||
        !isEmpty(meetup.description) ||
        !isEmpty(meetup.fileLink) ||
        !isEmpty(meetup.notes)
      ),
      step12_socialMedia: {
        strategyLink: prod.step12_socialMedia.strategyLink || { link: '', notes: '' },
        promotions: (prod.step12_socialMedia.promotions || [])
          .filter((promo) =>
            !isEmpty(promo.title) ||
            !isEmpty(promo.description) ||
            !isEmpty(promo.promotionChannelId) ||
            (promo.mediaFiles || []).some((file) => !isEmpty(file.name) || !isEmpty(file.link))
          )
          .map((promo) => ({
            ...promo,
            mediaFiles: (promo.mediaFiles || []).filter(
              (file) => !isEmpty(file.name) || !isEmpty(file.link)
            ),
          })),
      },
      step13_afterEvent: {
        eventSummary: prod.step13_afterEvent?.eventSummary || { link: '', notes: '' },
        eventRetrospective: prod.step13_afterEvent?.eventRetrospective || { link: '', notes: '' },
      },
    };
  };

  const saveProduction = async () => {
    if (!production) return;

    setIsSaving(true);
    setSaveStatus('saving');
    try {
      const cleanedProduction = cleanProductionData(production);
      const completionPercentage = calculateCompletionPercentage(cleanedProduction);

      const response = await fetch(`/api/productions/${productionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cleanedProduction,
          completionPercentage,
        }),
      });

      if (response.ok) {
        setProduction(cleanedProduction);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
      console.error('Error saving production:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updateProduction = useCallback(
    (updates: Partial<Production>) => {
      if (production) {
        setProduction({ ...production, ...updates });
        setHasUnsavedChanges(true);
      }
    },
    [production]
  );

  // Handle assignment changes
  const handleAssignmentChange = useCallback(
    async (section: string, userId: string | null) => {
      if (production) {
        const newAssignments: Record<string, string> = { ...(production.assignments || {}) };
        if (userId) {
          newAssignments[section] = userId;
        } else {
          delete newAssignments[section];
        }
        const updatedProduction = { ...production, assignments: newAssignments };
        setProduction(updatedProduction);

        // Save assignment directly to API to avoid race condition
        try {
          await fetch(`/api/productions/${productionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignments: newAssignments }),
          });
        } catch (error) {
          console.error('Error saving assignment:', error);
        }
      }
    },
    [production, productionId]
  );

  const handleStepChange = (stepKey: string) => {
    if (hasUnsavedChanges) {
      saveProduction();
    }
    setCurrentStepKey(stepKey);
    router.push(`/productions/${productionId}?step=${stepKey}`, { scroll: false });
  };

  const goToNextStep = () => {
    if (enabledSteps.length === 0) {
      const nextNum = currentStepNumber + 1;
      if (nextNum <= 17) {
        handleStepChange(`step${nextNum}`);
      }
      return;
    }
    const currentIndex = enabledSteps.findIndex((s) => s.stepKey === currentStepKey);
    if (currentIndex < enabledSteps.length - 1) {
      handleStepChange(enabledSteps[currentIndex + 1].stepKey);
    }
  };

  const goToPreviousStep = () => {
    if (enabledSteps.length === 0) {
      const prevNum = currentStepNumber - 1;
      if (prevNum >= 1) {
        handleStepChange(`step${prevNum}`);
      }
      return;
    }
    const currentIndex = enabledSteps.findIndex((s) => s.stepKey === currentStepKey);
    if (currentIndex > 0) {
      handleStepChange(enabledSteps[currentIndex - 1].stepKey);
    }
  };

  const isFirstStep = enabledSteps.length > 0
    ? currentStepKey === enabledSteps[0]?.stepKey
    : currentStepNumber === 1;

  const isLastStep = enabledSteps.length > 0
    ? currentStepKey === enabledSteps[enabledSteps.length - 1]?.stepKey
    : currentStepNumber === 17;

  if (!production) {
    return <LoadingOverlay isLoading={true} message="Loading..." />;
  }

  const completionPercentage = calculateCompletionPercentage(production);

  return (
    <>
      <LoadingOverlay isLoading={loading || isSaving} message={isSaving ? "Saving..." : "Loading..."} />
      <div className="min-h-screen bg-gray-50">
      <StepProgress
        currentStepKey={currentStepKey}
        completedStepKeys={[]}
        onStepClick={handleStepChange}
        completionPercentage={completionPercentage}
        stepConfig={stepConfig}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 max-w-3xl">
            <Input
              value={production.title}
              onChange={(e) => updateProduction({ title: e.target.value })}
              onBlur={saveProduction}
              className="text-5xl font-bold border-0 border-b-4 border-transparent hover:border-gray-300 focus:border-blue-500 px-0 rounded-none h-auto py-2 shadow-none focus-visible:ring-0 bg-transparent"
              placeholder={t('titlePlaceholder')}
            />
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>
                {t('lastSaved')}:{' '}
                {lastSaved ? lastSaved.toLocaleTimeString() : t('notSavedYet')}
              </span>
              {saveStatus === 'saving' && (
                <span className="text-blue-600">● {t('saving')}</span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-green-600">✓ {t('saved')}</span>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-600">✗ {t('errorSaving')}</span>
              )}
              {hasUnsavedChanges && !saveStatus && (
                <span className="text-yellow-600">● {t('unsavedChanges')}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/productions/${productionId}/dashboard`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {t('viewDashboard')}
            </Button>
            <Button onClick={saveProduction} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? t('saving') : t('saveNow')}
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {currentStepNumber === 1 && (
            <Step1Contract
              data={production.step1_contract}
              onChange={(data) => updateProduction({ step1_contract: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step1')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step1}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 2 && (
            <Step2Cities
              data={production.step2_cities}
              onChange={(data) => updateProduction({ step2_cities: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step2')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step2}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 3 && (
            <Step3VenueContracts
              data={production.step3_venueContracts}
              onChange={(data) => updateProduction({ step3_venueContracts: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step3')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step3}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 4 && (
            <Step4Itinerary
              data={production.step4_itinerary}
              onChange={(data) => updateProduction({ step4_itinerary: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step4')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step4}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 5 && (
            <Step5Materials
              data={production.step5_materials}
              onChange={(data) => updateProduction({ step5_materials: data })}
              onBlur={saveProduction}
              productionId={productionId}
              getLinkedItems={getLinkedItems}
              onKnowledgeChange={refetchKnowledge}
              assignments={production.assignments}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 6 && (
            <Step6VenueInfo
              data={production.step6_venueInfo}
              onChange={(data) => updateProduction({ step6_venueInfo: data })}
              onBlur={saveProduction}
              productionId={productionId}
              cities={production.step2_cities}
              linkedKnowledge={getLinkedItems('step6')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step6}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 7 && (
            <Step7Designs
              data={production.step7_designs}
              onChange={(data) => updateProduction({ step7_designs: data })}
              onBlur={saveProduction}
              productionId={productionId}
              getLinkedItems={getLinkedItems}
              onKnowledgeChange={refetchKnowledge}
              assignments={production.assignments}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 8 && (
            <Step8PromotionalImages
              data={production.step8_promotionalImages}
              onChange={(data) => updateProduction({ step8_promotionalImages: data })}
              onBlur={saveProduction}
              productionId={productionId}
              getLinkedItems={getLinkedItems}
              onKnowledgeChange={refetchKnowledge}
              assignments={production.assignments}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 9 && (
            <Step9Videos
              data={production.step9_videos}
              onChange={(data) => updateProduction({ step9_videos: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step9')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step9}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 10 && (
            <Step10PressConference
              data={production.step10_pressConference}
              onChange={(data) => updateProduction({ step10_pressConference: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step10')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step10}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 11 && (
            <Step11PerformanceShooting
              data={production.step11_performanceShooting}
              onChange={(data) => updateProduction({ step11_performanceShooting: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step11')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step11}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 12 && (
            <Step12SocialMedia
              data={production.step12_socialMedia}
              onChange={(data) => updateProduction({ step12_socialMedia: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step12')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step12}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 13 && (
            <Step13AfterEvent
              data={production.step13_afterEvent}
              onChange={(data) => updateProduction({ step13_afterEvent: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step13')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step13}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 14 && (
            <Step14SponsorshipPackages
              data={production.step14_sponsorshipPackages || []}
              onChange={(data) => updateProduction({ step14_sponsorshipPackages: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step14')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step14}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 15 && (
            <Step15CommunityAlliances
              data={production.step15_communityAlliances || []}
              onChange={(data) => updateProduction({ step15_communityAlliances: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step15')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step15}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 16 && (
            <Step16VenueMediaDesign
              data={production.step16_venueMediaDesign}
              onChange={(data) => updateProduction({ step16_venueMediaDesign: data })}
              onBlur={saveProduction}
              productionId={productionId}
              getLinkedItems={getLinkedItems}
              onKnowledgeChange={refetchKnowledge}
              assignments={production.assignments}
              onAssignmentChange={handleAssignmentChange}
            />
          )}

          {currentStepNumber === 17 && (
            <Step17Meetups
              data={production.step17_meetups || []}
              onChange={(data) => updateProduction({ step17_meetups: data })}
              onBlur={saveProduction}
              productionId={productionId}
              linkedKnowledge={getLinkedItems('step17')}
              onKnowledgeChange={refetchKnowledge}
              assignedUserId={production.assignments?.step17}
              onAssignmentChange={handleAssignmentChange}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={isFirstStep}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('previous')}
          </Button>

          <Button onClick={goToNextStep} disabled={isLastStep}>
            {t('next')}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}
