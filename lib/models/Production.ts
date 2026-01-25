import mongoose, { Schema, Document } from 'mongoose';

// Step 1: Contract
interface IContract {
  link: string;
  notes: string;
}

// Step 2: Cities and Dates
interface ICity {
  id: string;
  city: string;
  date: string;
  time: string;
  notes: string;
}

// Step 3: Venue Contracts
interface IVenueContract {
  id: string;
  linkedVenueId?: string;
  venueName: string;
  contractLink: string;
  notes: string;
}

// Step 4: Itinerary
interface IItinerary {
  link: string;
  notes: string;
}

// Step 5: Materials
interface IPhotos {
  link: string;
  notes: string;
}

interface ITexts {
  link: string;
  longDescription: string;
  shortDescription: string;
}

interface IMaterials {
  videos: IPhotos;
  performerVideos: IPhotos;
  musicCollection: IPhotos;
  photos: IPhotos;
  actorPhotos: IPhotos;
  otherPhotos: IPhotos;
  logos: IPhotos;
  texts: ITexts;
}

// Step 6: Venue Info
interface IVenueTicket {
  link: string;
  pricing: string;
}

interface IVenueSeatMap {
  link: string;
  notes: string;
}

interface IVenueTicketLink {
  link: string;
  notes: string;
}

interface IVenueRequiredForms {
  link: string;
  notes: string;
}

interface IVenueInfo {
  id: string;
  linkedVenueId?: string;
  venueName: string;
  address: string;
  contacts: string;
  otherInfo: string;
  requiredForms: IVenueRequiredForms;
  ticketDesign: IVenueTicket;
  seatMap: IVenueSeatMap;
  ticketLink: IVenueTicketLink;
}

// Step 7: Designs
interface IDesignFile {
  sourceFile: string;
  pdfFile: string;
  pngFile: string;
  qrCodes: string;
  trackingQrCodes: string;
  notes: string;
}

interface IDesigns {
  backdrop: IDesignFile;
  rollupBanner: IDesignFile;
}

// Step 8: Promotional Images
interface IImageVersion {
  id: string;
  versionType: 'main-visual' | 'performance-scene' | 'main-actor';
  chineseLink: string;
  englishLink: string;
  notes: string;
}

interface IPoster4x3 {
  id: string;
  versionType: 'main-visual' | 'performance-scene' | 'main-actor';
  usage: 'print' | 'digital';
  chineseLink: string;
  englishLink: string;
  notes: string;
}

interface IPromotionalImages {
  poster16_9: IImageVersion[];
  thumbnail1_1: IImageVersion[];
  poster1_1: IImageVersion[];
  poster9_16: IImageVersion[];
  poster4_3: IPoster4x3[];
  cover5_2: IImageVersion[];
}

// Step 9: Videos
interface IVideoLink {
  link: string;
  notes: string;
}

interface IVideos {
  conferenceLoop: IVideoLink;
  mainPromo: IVideoLink;
  actorIntro: IVideoLink;
}

// Step 10: Press Conference
interface IVenueBasic {
  datetime: string;
  location: string;
  notes: string;
}

interface ILinkWithNotes {
  link: string;
  notes: string;
}

interface IPrintable extends ILinkWithNotes {
  isPrinted: boolean;
}

interface IOnSiteFootage {
  closeUps: string;
  scenery: string;
  notes: string;
}

interface IPressConference {
  venue: IVenueBasic;
  invitation: ILinkWithNotes;
  guestList: ILinkWithNotes;
  pressRelease: ILinkWithNotes;
  backdropVideo: ILinkWithNotes;
  backgroundMusic: ILinkWithNotes;
  screenContent: ILinkWithNotes;
  rollupBannerPDF: IPrintable;
  smallPoster: IPrintable;
  onSiteFootage: IOnSiteFootage;
}

// Step 11: Performance Shooting
interface IPerformanceShooting {
  googleDriveLink: string;
  notes: string;
}

// Step 12: Social Media
interface IWebsiteUpdate {
  isAdded: boolean;
  link: string;
  notes: string;
}

interface IPost {
  id: string;
  stage: 'warm-up' | 'ticket-launch' | 'promotion' | 'live' | 'summary';
  postLink: string;
  publishDate: string;
  notes: string;
}

interface IPlatform {
  id: string;
  platformName: string;
  posts: IPost[];
}

interface IFacebookEvent {
  link: string;
  notes: string;
}

interface ISocialMedia {
  websiteUpdated: IWebsiteUpdate;
  platforms: IPlatform[];
  facebookEvent: IFacebookEvent;
}

// Step 13: Advertising
interface ITargetAudience {
  id: string;
  platformName: string;
  targetAudience: ('chinese' | 'western')[];
  resourceLink: string;
  notes: string;
}

interface IOfflineAdvertising {
  id: string;
  organizationName: string;
  targetAudience: ('chinese' | 'western')[];
  googleResourceLink: string;
  notes: string;
}

interface IAdvertising {
  online: ITargetAudience[];
  offline: IOfflineAdvertising[];
}

// Step 14: Sponsorship Packages
interface ISponsorshipPackage {
  id: string;
  name: string;
  planDetail: string;
  fileLink: string;
  note: string;
}

// Step 15: Community Alliance
interface ICommunityAlliance {
  id: string;
  communityId: string;
  communityName: string;
  allianceDetail: string;
  files: string;
  note: string;
}

// Main Production Interface
export interface IProduction extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  completionPercentage: number;

  // 13 Steps
  step1_contract: IContract;
  step2_cities: ICity[];
  step3_venueContracts: IVenueContract[];
  step4_itinerary: IItinerary;
  step5_materials: IMaterials;
  step6_venueInfo: IVenueInfo[];
  step7_designs: IDesigns;
  step8_promotionalImages: IPromotionalImages;
  step9_videos: IVideos;
  step10_pressConference: IPressConference;
  step11_performanceShooting: IPerformanceShooting;
  step12_socialMedia: ISocialMedia;
  step13_advertising: IAdvertising;
  step14_sponsorshipPackages: ISponsorshipPackage[];
  step15_communityAlliances: ICommunityAlliance[];

  // Step assignments (user ID for each step/sub-step)
  assignments?: Record<string, string>;

  // Knowledge Base Links (21 sections: 15 steps + 6 subsections of step 5)
  knowledgeLinks_step1?: string[];
  knowledgeLinks_step2?: string[];
  knowledgeLinks_step3?: string[];
  knowledgeLinks_step4?: string[];
  knowledgeLinks_step5_videos?: string[];
  knowledgeLinks_step5_performerVideos?: string[];
  knowledgeLinks_step5_musicCollection?: string[];
  knowledgeLinks_step5_photos?: string[];
  knowledgeLinks_step5_actorPhotos?: string[];
  knowledgeLinks_step5_otherPhotos?: string[];
  knowledgeLinks_step5_logos?: string[];
  knowledgeLinks_step5_texts?: string[];
  knowledgeLinks_step6?: string[];
  knowledgeLinks_step7?: string[];
  knowledgeLinks_step8?: string[];
  knowledgeLinks_step9?: string[];
  knowledgeLinks_step10?: string[];
  knowledgeLinks_step11?: string[];
  knowledgeLinks_step12?: string[];
  knowledgeLinks_step13?: string[];
  knowledgeLinks_step14?: string[];
  knowledgeLinks_step15?: string[];
}

const ProductionSchema = new Schema<IProduction>(
  {
    title: { type: String, required: true },
    completionPercentage: { type: Number, default: 0 },

    // Step 1: Contract
    step1_contract: {
      link: { type: String, default: '' },
      notes: { type: String, default: '' },
    },

    // Step 2: Cities
    step2_cities: [{
      id: { type: String, required: true },
      city: { type: String, default: '' },
      date: { type: String, default: '' },
      time: { type: String, default: '' },
      notes: { type: String, default: '' },
    }],

    // Step 3: Venue Contracts
    step3_venueContracts: [{
      id: { type: String, required: true },
      linkedVenueId: { type: String },
      venueName: { type: String, default: '' },
      contractLink: { type: String, default: '' },
      notes: { type: String, default: '' },
    }],

    // Step 4: Itinerary
    step4_itinerary: {
      link: { type: String, default: '' },
      notes: { type: String, default: '' },
    },

    // Step 5: Materials
    step5_materials: {
      videos: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      performerVideos: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      musicCollection: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      photos: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      actorPhotos: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      otherPhotos: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      logos: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      texts: {
        link: { type: String, default: '' },
        longDescription: { type: String, default: '' },
        shortDescription: { type: String, default: '' },
      },
    },

    // Step 6: Venue Info
    step6_venueInfo: [{
      id: { type: String, required: true },
      linkedVenueId: { type: String },
      venueName: { type: String, default: '' },
      address: { type: String, default: '' },
      contacts: { type: String, default: '' },
      otherInfo: { type: String, default: '' },
      requiredForms: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      ticketDesign: {
        link: { type: String, default: '' },
        pricing: { type: String, default: '' },
      },
      seatMap: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      ticketLink: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
    }],

    // Step 7: Designs
    step7_designs: {
      backdrop: {
        sourceFile: { type: String, default: '' },
        pdfFile: { type: String, default: '' },
        pngFile: { type: String, default: '' },
        qrCodes: { type: String, default: '' },
        trackingQrCodes: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      rollupBanner: {
        sourceFile: { type: String, default: '' },
        pdfFile: { type: String, default: '' },
        pngFile: { type: String, default: '' },
        qrCodes: { type: String, default: '' },
        trackingQrCodes: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
    },

    // Step 8: Promotional Images
    step8_promotionalImages: {
      poster16_9: [{
        id: { type: String, required: true },
        versionType: { type: String, enum: ['main-visual', 'performance-scene', 'main-actor'], default: 'main-visual' },
        chineseLink: { type: String, default: '' },
        englishLink: { type: String, default: '' },
        notes: { type: String, default: '' },
      }],
      thumbnail1_1: [{
        id: { type: String, required: true },
        versionType: { type: String, enum: ['main-visual', 'performance-scene', 'main-actor'], default: 'main-visual' },
        chineseLink: { type: String, default: '' },
        englishLink: { type: String, default: '' },
        notes: { type: String, default: '' },
      }],
      poster1_1: [{
        id: { type: String, required: true },
        versionType: { type: String, enum: ['main-visual', 'performance-scene', 'main-actor'], default: 'main-visual' },
        chineseLink: { type: String, default: '' },
        englishLink: { type: String, default: '' },
        notes: { type: String, default: '' },
      }],
      poster9_16: [{
        id: { type: String, required: true },
        versionType: { type: String, enum: ['main-visual', 'performance-scene', 'main-actor'], default: 'main-visual' },
        chineseLink: { type: String, default: '' },
        englishLink: { type: String, default: '' },
        notes: { type: String, default: '' },
      }],
      poster4_3: [{
        id: { type: String, required: true },
        versionType: { type: String, enum: ['main-visual', 'performance-scene', 'main-actor'], default: 'main-visual' },
        usage: { type: String, enum: ['print', 'digital'], default: 'digital' },
        chineseLink: { type: String, default: '' },
        englishLink: { type: String, default: '' },
        notes: { type: String, default: '' },
      }],
      cover5_2: [{
        id: { type: String, required: true },
        versionType: { type: String, enum: ['main-visual', 'performance-scene', 'main-actor'], default: 'main-visual' },
        chineseLink: { type: String, default: '' },
        englishLink: { type: String, default: '' },
        notes: { type: String, default: '' },
      }],
    },

    // Step 9: Videos
    step9_videos: {
      conferenceLoop: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      mainPromo: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      actorIntro: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
    },

    // Step 10: Press Conference
    step10_pressConference: {
      venue: {
        datetime: { type: String, default: '' },
        location: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      invitation: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      guestList: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      pressRelease: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      backdropVideo: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      backgroundMusic: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      screenContent: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      rollupBannerPDF: {
        link: { type: String, default: '' },
        isPrinted: { type: Boolean, default: false },
        notes: { type: String, default: '' },
      },
      smallPoster: {
        link: { type: String, default: '' },
        isPrinted: { type: Boolean, default: false },
        notes: { type: String, default: '' },
      },
      onSiteFootage: {
        closeUps: { type: String, default: '' },
        scenery: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
    },

    // Step 11: Performance Shooting
    step11_performanceShooting: {
      googleDriveLink: { type: String, default: '' },
      notes: { type: String, default: '' },
    },

    // Step 12: Social Media
    step12_socialMedia: {
      websiteUpdated: {
        isAdded: { type: Boolean, default: false },
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      platforms: [{
        id: { type: String, required: true },
        platformName: { type: String, default: '' },
        posts: [{
          id: { type: String, required: true },
          stage: { type: String, enum: ['warm-up', 'ticket-launch', 'promotion', 'live', 'summary'], default: 'warm-up' },
          postLink: { type: String, default: '' },
          publishDate: { type: String, default: '' },
          notes: { type: String, default: '' },
        }],
      }],
      facebookEvent: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
    },

    // Step 13: Advertising
    step13_advertising: {
      online: [{
        id: { type: String, required: true },
        platformName: { type: String, default: '' },
        targetAudience: [{ type: String, enum: ['chinese', 'western'] }],
        resourceLink: { type: String, default: '' },
        notes: { type: String, default: '' },
      }],
      offline: [{
        id: { type: String, required: true },
        organizationName: { type: String, default: '' },
        targetAudience: [{ type: String, enum: ['chinese', 'western'] }],
        googleResourceLink: { type: String, default: '' },
        notes: { type: String, default: '' },
      }],
    },

    // Step 14: Sponsorship Packages
    step14_sponsorshipPackages: [{
      id: { type: String, required: true },
      name: { type: String, default: '' },
      planDetail: { type: String, default: '' },
      fileLink: { type: String, default: '' },
      note: { type: String, default: '' },
    }],

    // Step 15: Community Alliances
    step15_communityAlliances: [{
      id: { type: String, required: true },
      communityId: { type: String, default: '' },
      communityName: { type: String, default: '' },
      allianceDetail: { type: String, default: '' },
      files: { type: String, default: '' },
      note: { type: String, default: '' },
    }],

    // Step assignments
    assignments: { type: Map, of: String, default: {} },

    // Knowledge Base Links
    knowledgeLinks_step1: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step2: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step3: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step4: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step5_videos: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step5_performerVideos: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step5_musicCollection: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step5_photos: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step5_actorPhotos: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step5_otherPhotos: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step5_logos: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step5_texts: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step6: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step7: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step8: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step9: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step10: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step11: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step12: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step13: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step14: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
    knowledgeLinks_step15: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
  },
  {
    timestamps: true,
  }
);

const existingProduction = mongoose.models.Production;
if (existingProduction) {
  const videosPath = existingProduction.schema.path('step5_materials.videos');
  const logosPath = existingProduction.schema.path('step5_materials.logos');
  if (videosPath?.instance === 'Array' || logosPath?.instance === 'Array') {
    delete mongoose.models.Production;
  }
}

// Create or retrieve the model
const Production = mongoose.models.Production || mongoose.model<IProduction>('Production', ProductionSchema);

export default Production;
