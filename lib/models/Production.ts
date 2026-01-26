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
  previewImage?: string;
  requiredForms: IVenueRequiredForms;
  ticketDesign: IVenueTicket;
  seatMap: IVenueSeatMap;
  ticketLink: IVenueTicketLink;
}

// Step 7: Designs
interface IMediaDesignItem {
  id: string;
  title: string;
  description: string;
  mediaPackageIds: string[];
  mediaPackageLinks: Record<string, string>;
}

interface IDesigns {
  media: IMediaDesignItem[];
}

// Step 8: Promotional Images
interface IPromotionalImages {
  media: IMediaDesignItem[];
}

interface IVideos {
  media: IMediaDesignItem[];
}

interface ILinkWithNotes {
  link: string;
  notes: string;
}

interface IPressConference {
  location: string;
  invitationLetter: ILinkWithNotes;
  guestList: ILinkWithNotes;
  pressRelease: ILinkWithNotes;
  media: IMediaDesignItem[];
}

// Step 11: Performance Shooting
interface IPerformanceShooting {
  googleDriveLink: string;
  notes: string;
}

// Step 12: Social Media
interface IPromoMediaFile {
  id: string;
  name: string;
  link: string;
}

interface IPromotionItem {
  id: string;
  title: string;
  description: string;
  promotionChannelId: string;
  mediaFiles: IPromoMediaFile[];
}

interface ISocialMedia {
  strategyLink: ILinkWithNotes;
  promotions: IPromotionItem[];
}

// Step 13: After Event
interface IAfterEvent {
  eventSummary: ILinkWithNotes;
  eventRetrospective: ILinkWithNotes;
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

  // Steps
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
  step13_afterEvent: IAfterEvent;
  step14_sponsorshipPackages: ISponsorshipPackage[];
  step15_communityAlliances: ICommunityAlliance[];
  step16_venueMediaDesign: IDesigns;

  // Step assignments (user ID for each step/sub-step)
  assignments?: Record<string, string>;

  // Knowledge Base Links
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
  knowledgeLinks_step16?: string[];
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
      previewImage: { type: String, default: '' },
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
      media: {
        type: [{
          id: { type: String, required: true },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          mediaPackageIds: { type: [String], default: [] },
          mediaPackageLinks: { type: Map, of: String, default: {} },
        }],
        default: [],
      },
    },

    // Step 8: Promotional Images
    step8_promotionalImages: {
      media: {
        type: [{
          id: { type: String, required: true },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          mediaPackageIds: { type: [String], default: [] },
          mediaPackageLinks: { type: Map, of: String, default: {} },
        }],
        default: [],
      },
    },

    // Step 9: Videos
    step9_videos: {
      media: {
        type: [{
          id: { type: String, required: true },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          mediaPackageIds: { type: [String], default: [] },
          mediaPackageLinks: { type: Map, of: String, default: {} },
        }],
        default: [],
      },
    },

    // Step 10: Press Conference
    step10_pressConference: {
      location: { type: String, default: '' },
      invitationLetter: {
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
      media: {
        type: [{
          id: { type: String, required: true },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          mediaPackageIds: { type: [String], default: [] },
          mediaPackageLinks: { type: Map, of: String, default: {} },
        }],
        default: [],
      },
    },

    // Step 11: Performance Shooting
    step11_performanceShooting: {
      googleDriveLink: { type: String, default: '' },
      notes: { type: String, default: '' },
    },

    // Step 12: Online Promotion
    step12_socialMedia: {
      strategyLink: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      promotions: {
        type: [{
          id: { type: String, required: true },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          promotionChannelId: { type: String, default: '' },
          mediaFiles: [{
            id: { type: String, required: true },
            name: { type: String, default: '' },
            link: { type: String, default: '' },
          }],
        }],
        default: [],
      },
    },

    // Step 13: After Event
    step13_afterEvent: {
      eventSummary: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
      eventRetrospective: {
        link: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
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

    // Step 16: Venue Media Design
    step16_venueMediaDesign: {
      media: {
        type: [{
          id: { type: String, required: true },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          mediaPackageIds: { type: [String], default: [] },
          mediaPackageLinks: { type: Map, of: String, default: {} },
        }],
        default: [],
      },
    },

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
    knowledgeLinks_step16: [{ type: String, ref: 'KnowledgeBaseItem', default: [] }],
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
