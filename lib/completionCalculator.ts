import type { Production } from '@/types/production';

interface FieldCount {
  total: number;
  filled: number;
}

// Helper function to check if a string field is filled
const isStringFilled = (value: any): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

// Helper function to check if an object with link and notes is filled
const isLinkNotesObjectFilled = (obj: any): FieldCount => {
  if (!obj) return { total: 2, filled: 0 };

  let filled = 0;
  if (isStringFilled(obj.link)) filled++;
  if (isStringFilled(obj.notes)) filled++;

  return { total: 2, filled };
};

export function calculateCompletionPercentage(production: Partial<Production>): number {
  let totalFields = 0;
  let filledFields = 0;

  // Step 1: Contract
  if (production.step1_contract) {
    const count = isLinkNotesObjectFilled(production.step1_contract);
    totalFields += count.total;
    filledFields += count.filled;
  }

  // Step 2: Cities (array - at least one city with all fields filled)
  totalFields += 1; // Expecting at least one city
  if (production.step2_cities && production.step2_cities.length > 0) {
    const firstCity = production.step2_cities[0];
    let cityFields = 0;
    let cityFilled = 0;

    // Each city has 4 main fields: city, date, time, notes
    cityFields += 4;
    if (isStringFilled(firstCity.city)) cityFilled++;
    if (isStringFilled(firstCity.date)) cityFilled++;
    if (isStringFilled(firstCity.time)) cityFilled++;
    if (isStringFilled(firstCity.notes)) cityFilled++;

    totalFields += cityFields;
    filledFields += cityFilled;

    // If there's at least one city, count it as the array being started
    filledFields += 0.5;
  }

  // Step 3: Venue Contracts (array)
  totalFields += 1;
  if (production.step3_venueContracts && production.step3_venueContracts.length > 0) {
    filledFields += 0.5;
    const firstVenue = production.step3_venueContracts[0];
    let venueFields = 0;
    let venueFilled = 0;

    venueFields += 3; // venueName, contractLink, notes
    if (isStringFilled(firstVenue.venueName)) venueFilled++;
    if (isStringFilled(firstVenue.contractLink)) venueFilled++;
    if (isStringFilled(firstVenue.notes)) venueFilled++;

    totalFields += venueFields;
    filledFields += venueFilled;
  }

  // Step 4: Itinerary
  if (production.step4_itinerary) {
    const count = isLinkNotesObjectFilled(production.step4_itinerary);
    totalFields += count.total;
    filledFields += count.filled;
  }

  // Step 5: Materials
  if (production.step5_materials) {
    const materials = production.step5_materials;

    // 5.1 Videos
    const videosCount = isLinkNotesObjectFilled(materials.videos);
    totalFields += videosCount.total;
    filledFields += videosCount.filled;

    // 5.2 Performer Videos
    const performerVideosCount = isLinkNotesObjectFilled(materials.performerVideos);
    totalFields += performerVideosCount.total;
    filledFields += performerVideosCount.filled;

    // 5.3 Music Collection
    const musicCollectionCount = isLinkNotesObjectFilled(materials.musicCollection);
    totalFields += musicCollectionCount.total;
    filledFields += musicCollectionCount.filled;

    // 5.4 Performance Scene Photos
    const photosCount = isLinkNotesObjectFilled(materials.photos);
    totalFields += photosCount.total;
    filledFields += photosCount.filled;

    // 5.5 Performer Photos
    const actorPhotosCount = isLinkNotesObjectFilled(materials.actorPhotos);
    totalFields += actorPhotosCount.total;
    filledFields += actorPhotosCount.filled;

    // 5.6 Other Photos
    const otherPhotosCount = isLinkNotesObjectFilled(materials.otherPhotos);
    totalFields += otherPhotosCount.total;
    filledFields += otherPhotosCount.filled;

    // 5.7 Logos
    const logosCount = isLinkNotesObjectFilled(materials.logos);
    totalFields += logosCount.total;
    filledFields += logosCount.filled;

    // 5.8 Texts
    if (materials.texts) {
      totalFields += 3;
      if (isStringFilled(materials.texts.link)) filledFields++;
      if (isStringFilled(materials.texts.longDescription)) filledFields++;
      if (isStringFilled(materials.texts.shortDescription)) filledFields++;
    }
  }

  // Step 6: Venue Info (array)
  totalFields += 1;
  if (production.step6_venueInfo && production.step6_venueInfo.length > 0) {
    filledFields += 0.5;
    const firstVenue = production.step6_venueInfo[0];

    totalFields += 4; // venueName, address, contacts, otherInfo
    if (isStringFilled(firstVenue.venueName)) filledFields++;
    if (isStringFilled(firstVenue.address)) filledFields++;
    if (isStringFilled(firstVenue.contacts)) filledFields++;
    if (isStringFilled(firstVenue.otherInfo)) filledFields++;

    // Required forms
    const formsCount = isLinkNotesObjectFilled(firstVenue.requiredForms);
    totalFields += formsCount.total;
    filledFields += formsCount.filled;

    // Ticket design
    totalFields += 2; // link and pricing
    if (isStringFilled(firstVenue.ticketDesign.link)) filledFields++;
    if (isStringFilled(firstVenue.ticketDesign.pricing)) filledFields++;

    // Seat map
    const seatMapCount = isLinkNotesObjectFilled(firstVenue.seatMap);
    totalFields += seatMapCount.total;
    filledFields += seatMapCount.filled;

    // Ticket link
    const ticketLinkCount = isLinkNotesObjectFilled(firstVenue.ticketLink);
    totalFields += ticketLinkCount.total;
    filledFields += ticketLinkCount.filled;
  }

  // Step 7: Designs
  if (production.step7_designs) {
    totalFields += 1;
    if (production.step7_designs.media && production.step7_designs.media.length > 0) {
      filledFields += 0.5;
      production.step7_designs.media.forEach((item) => {
        totalFields += 3;
        if (isStringFilled(item.title)) filledFields++;
        if (item.mediaPackageIds && item.mediaPackageIds.length > 0) filledFields++;
        const packageLinks = item.mediaPackageLinks || {};
        const hasAllLinks = (item.mediaPackageIds || []).every(
          (pkgId) => isStringFilled(packageLinks[pkgId])
        );
        if (hasAllLinks && (item.mediaPackageIds || []).length > 0) filledFields++;
      });
    }
  }

  // Step 8: Promotional Images
  if (production.step8_promotionalImages) {
    totalFields += 1;
    if (production.step8_promotionalImages.media && production.step8_promotionalImages.media.length > 0) {
      filledFields += 0.5;
      production.step8_promotionalImages.media.forEach((item) => {
        totalFields += 3;
        if (isStringFilled(item.title)) filledFields++;
        if (item.mediaPackageIds && item.mediaPackageIds.length > 0) filledFields++;
        const packageLinks = item.mediaPackageLinks || {};
        const hasAllLinks = (item.mediaPackageIds || []).every(
          (pkgId) => isStringFilled(packageLinks[pkgId])
        );
        if (hasAllLinks && (item.mediaPackageIds || []).length > 0) filledFields++;
      });
    }
  }

  // Step 9: Videos
  if (production.step9_videos) {
    totalFields += 1;
    if (production.step9_videos.media && production.step9_videos.media.length > 0) {
      filledFields += 0.5;
      production.step9_videos.media.forEach((item) => {
        totalFields += 3;
        if (isStringFilled(item.title)) filledFields++;
        if (item.mediaPackageIds && item.mediaPackageIds.length > 0) filledFields++;
        const packageLinks = item.mediaPackageLinks || {};
        const hasAllLinks = (item.mediaPackageIds || []).every(
          (pkgId) => isStringFilled(packageLinks[pkgId])
        );
        if (hasAllLinks && (item.mediaPackageIds || []).length > 0) filledFields++;
      });
    }
  }

  // Step 16: Venue Media Design
  if (production.step16_venueMediaDesign) {
    totalFields += 1;
    if (production.step16_venueMediaDesign.media && production.step16_venueMediaDesign.media.length > 0) {
      filledFields += 0.5;
      production.step16_venueMediaDesign.media.forEach((item) => {
        totalFields += 3;
        if (isStringFilled(item.title)) filledFields++;
        if (item.mediaPackageIds && item.mediaPackageIds.length > 0) filledFields++;
        const packageLinks = item.mediaPackageLinks || {};
        const hasAllLinks = (item.mediaPackageIds || []).every(
          (pkgId) => isStringFilled(packageLinks[pkgId])
        );
        if (hasAllLinks && (item.mediaPackageIds || []).length > 0) filledFields++;
      });
    }
  }

  // Step 10: Press Conference
  if (production.step10_pressConference) {
    const press = production.step10_pressConference;

    totalFields += 1;
    if (isStringFilled(press.location)) filledFields++;

    const invitationCount = isLinkNotesObjectFilled(press.invitationLetter);
    totalFields += invitationCount.total;
    filledFields += invitationCount.filled;

    const guestCount = isLinkNotesObjectFilled(press.guestList);
    totalFields += guestCount.total;
    filledFields += guestCount.filled;

    const pressReleaseCount = isLinkNotesObjectFilled(press.pressRelease);
    totalFields += pressReleaseCount.total;
    filledFields += pressReleaseCount.filled;

    totalFields += 1;
    if (press.media && press.media.length > 0) {
      filledFields += 0.5;
      press.media.forEach((item) => {
        totalFields += 3;
        if (isStringFilled(item.title)) filledFields++;
        if (item.mediaPackageIds && item.mediaPackageIds.length > 0) filledFields++;
        const packageLinks = item.mediaPackageLinks || {};
        const hasAllLinks = (item.mediaPackageIds || []).every(
          (pkgId) => isStringFilled(packageLinks[pkgId])
        );
        if (hasAllLinks && (item.mediaPackageIds || []).length > 0) filledFields++;
      });
    }
  }

  // Step 11: Performance Shooting
  if (production.step11_performanceShooting) {
    totalFields += 2;
    if (isStringFilled(production.step11_performanceShooting.googleDriveLink)) filledFields++;
    if (isStringFilled(production.step11_performanceShooting.notes)) filledFields++;
  }

  // Step 12: Social Media
  if (production.step12_socialMedia) {
    const social = production.step12_socialMedia;

    const strategyCount = isLinkNotesObjectFilled(social.strategyLink);
    totalFields += strategyCount.total;
    filledFields += strategyCount.filled;

    // Promotions (at least one)
    totalFields += 1;
    if (social.promotions && social.promotions.length > 0) filledFields++;
  }

  // Step 13: After Event
  if (production.step13_afterEvent) {
    const summaryCount = isLinkNotesObjectFilled(production.step13_afterEvent.eventSummary);
    totalFields += summaryCount.total;
    filledFields += summaryCount.filled;

    const retrospectiveCount = isLinkNotesObjectFilled(production.step13_afterEvent.eventRetrospective);
    totalFields += retrospectiveCount.total;
    filledFields += retrospectiveCount.filled;
  }

  // Step 17: Meet-ups
  if (production.step17_meetups) {
    totalFields += 1;
    if (production.step17_meetups.length > 0) {
      filledFields += 0.5;
      const firstMeetup = production.step17_meetups[0];
      totalFields += 5;
      if (isStringFilled(firstMeetup.title)) filledFields++;
      if (isStringFilled(firstMeetup.datetime)) filledFields++;
      if (isStringFilled(firstMeetup.location)) filledFields++;
      if (isStringFilled(firstMeetup.description)) filledFields++;
      if (isStringFilled(firstMeetup.fileLink)) filledFields++;
    }
  }

  // Calculate percentage
  if (totalFields === 0) return 0;
  return Math.round((filledFields / totalFields) * 100);
}

// Calculate step-specific completion
export function calculateStepCompletion(production: Partial<Production>, stepNumber: number): number {
  // This is a simplified version - you can implement detailed step-by-step calculation if needed
  const fullCompletion = calculateCompletionPercentage(production);

  // For now, return overall completion
  // TODO: Implement per-step calculation if needed
  return fullCompletion;
}

export type StepStatus = 'completed' | 'in-progress' | 'not-started';

export function getStepStatus(production: Partial<Production>, stepNumber: number): StepStatus {
  const completion = calculateStepCompletion(production, stepNumber);

  if (completion === 100) return 'completed';
  if (completion > 0) return 'in-progress';
  return 'not-started';
}
