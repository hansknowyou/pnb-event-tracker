// Step 1: Contract
export interface Contract {
  link: string;
  notes: string;
}

// Step 2: Cities and Dates
export interface City {
  id: string;
  city: string;
  date: string;
  time: string;
  notes: string;
}

// Step 3: Venue Contracts
export interface VenueContract {
  id: string;
  linkedVenueId?: string; // Link to venue database
  venueName: string;
  contractLink: string;
  notes: string;
}

// Step 4: Itinerary
export interface Itinerary {
  link: string;
  notes: string;
}

export interface Photos {
  link: string;
  notes: string;
}

export interface Texts {
  link: string;
  shortDescription: string;
  longDescription: string;
}

export interface Materials {
  videos: Photos;
  performerVideos: Photos;
  musicCollection: Photos;
  photos: Photos;
  actorPhotos: Photos;
  otherPhotos: Photos;
  logos: Photos;
  texts: Texts;
}

// Step 6: Venue Info
export interface VenueTicket {
  link: string;
  pricing: string;
}

export interface VenueSeatMap {
  link: string;
  notes: string;
}

export interface VenueTicketLink {
  link: string;
  notes: string;
}

export interface VenueRequiredForms {
  link: string;
  notes: string;
}

export interface VenueInfo {
  id: string;
  linkedVenueId?: string; // Link to venue database
  venueName: string;
  address: string;
  contacts: string;
  otherInfo: string;
  previewImage?: string;
  requiredForms: VenueRequiredForms;
  ticketDesign: VenueTicket;
  seatMap: VenueSeatMap;
  ticketLink: VenueTicketLink;
}

// Step 7: Designs
export interface MediaDesignItem {
  id: string;
  title: string;
  description: string;
  mediaPackageIds: string[];
  mediaLink: string;
}

export interface Designs {
  media: MediaDesignItem[];
}

// Step 8: Promotional Images
export interface ImageVersion {
  id: string;
  versionType: 'main-visual' | 'performance-scene' | 'main-actor';
  chineseLink: string;
  englishLink: string;
  notes: string;
}

export interface Poster4x3 {
  id: string;
  versionType: 'main-visual' | 'performance-scene' | 'main-actor';
  usage: 'print' | 'digital';
  chineseLink: string;
  englishLink: string;
  notes: string;
}

export interface PromotionalImages {
  media: MediaDesignItem[];
}

// Step 9: Videos
export interface VideoLink {
  link: string;
  notes: string;
}

export interface Videos {
  media: MediaDesignItem[];
}

// Step 10: Press Conference
export interface VenueBasic {
  datetime: string;
  location: string;
  notes: string;
}

export interface LinkWithNotes {
  link: string;
  notes: string;
}

export interface Printable extends LinkWithNotes {
  isPrinted: boolean;
}

export interface OnSiteFootage {
  closeUps: string;
  scenery: string;
  notes: string;
}

export interface PressConference {
  venue: VenueBasic;
  invitation: LinkWithNotes;
  guestList: LinkWithNotes;
  pressRelease: LinkWithNotes;
  backdropVideo: LinkWithNotes;
  backgroundMusic: LinkWithNotes;
  screenContent: LinkWithNotes;
  rollupBannerPDF: Printable;
  smallPoster: Printable;
  onSiteFootage: OnSiteFootage;
}

// Step 11: Performance Shooting
export interface PerformanceShooting {
  googleDriveLink: string;
  notes: string;
}

// Step 12: Social Media
export interface WebsiteUpdate {
  isAdded: boolean;
  link: string;
  notes: string;
}

export interface Post {
  id: string;
  stage: 'warm-up' | 'ticket-launch' | 'promotion' | 'live' | 'summary';
  postLink: string;
  publishDate: string;
  notes: string;
}

export interface Platform {
  id: string;
  platformName: string;
  posts: Post[];
}

export interface FacebookEvent {
  link: string;
  notes: string;
}

export interface SocialMedia {
  websiteUpdated: WebsiteUpdate;
  platforms: Platform[];
  facebookEvent: FacebookEvent;
}

// Step 13: Advertising
export interface TargetAudience {
  id: string;
  platformName: string;
  targetAudience: ('chinese' | 'western')[];
  resourceLink: string;
  notes: string;
}

export interface OfflineAdvertising {
  id: string;
  organizationName: string;
  targetAudience: ('chinese' | 'western')[];
  googleResourceLink: string;
  notes: string;
}

export interface Advertising {
  online: TargetAudience[];
  offline: OfflineAdvertising[];
}

// Step 14: Sponsorship Package Planning
export interface SponsorshipPackage {
  id: string;
  name: string;
  planDetail: string;
  fileLink: string;
  note: string;
}

// Step 15: Community Alliance
export interface CommunityAlliance {
  id: string;
  communityId: string;
  communityName: string;
  allianceDetail: string;
  files: string;
  note: string;
}

// Main Production Type
export interface Production {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  completionPercentage: number;

  // Steps
  step1_contract: Contract;
  step2_cities: City[];
  step3_venueContracts: VenueContract[];
  step4_itinerary: Itinerary;
  step5_materials: Materials;
  step6_venueInfo: VenueInfo[];
  step7_designs: Designs;
  step8_promotionalImages: PromotionalImages;
  step9_videos: Videos;
  step10_pressConference: PressConference;
  step11_performanceShooting: PerformanceShooting;
  step12_socialMedia: SocialMedia;
  step13_advertising: Advertising;
  step14_sponsorshipPackages: SponsorshipPackage[];
  step15_communityAlliances: CommunityAlliance[];

  // Knowledge Base Links (20 sections: 14 steps + 6 subsections of step 5)
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

  // Step assignments (user ID for each step/sub-step)
  assignments?: Record<string, string>;
}

// Step information for the form
export interface StepInfo {
  number: number;
  name: string;
  description: string;
}

export const STEPS: StepInfo[] = [
  { number: 1, name: '演出合同签订', description: 'Contract Signing' },
  { number: 2, name: '确定演出城市与时间', description: 'Cities & Dates' },
  { number: 3, name: '场馆合同签订', description: 'Venue Contracts' },
  { number: 4, name: '演出团队行程', description: 'Team Itinerary' },
  { number: 5, name: '基础素材收集', description: 'Material Collection' },
  { number: 6, name: '场馆信息收集', description: 'Venue Information' },
  { number: 7, name: '背景版与易拉宝设计', description: 'Backdrop & Banner Design' },
  { number: 8, name: '图片媒体宣传图制作', description: 'Promotional Images' },
  { number: 9, name: '视频媒体制作', description: 'Video Production' },
  { number: 10, name: '媒体发布会收集', description: 'Press Conference' },
  { number: 11, name: '演出拍摄收集', description: 'Performance Shooting' },
  { number: 12, name: '社媒宣传', description: 'Social Media' },
  { number: 13, name: '投流宣传', description: 'Advertising' },
  { number: 14, name: '赞助方案筹备', description: 'Sponsorship Package Planning' },
  { number: 15, name: '社团联合', description: 'Community Alliance' },
];

// Status type for steps
export type StepStatus = 'completed' | 'in-progress' | 'not-started';
