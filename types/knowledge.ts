export interface KnowledgeBaseItem {
  _id: string;
  title: string;
  description: string; // HTML from TipTap
  imageUrl?: string;
  imageKey?: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface ProductionKnowledgeLinks {
  step1?: string[];
  step2?: string[];
  step3?: string[];
  step4?: string[];
  step5?: string[];
  step5_videos?: string[];
  step5_performerVideos?: string[];
  step5_photos?: string[];
  step5_actorPhotos?: string[];
  step5_otherPhotos?: string[];
  step5_logos?: string[];
  step5_texts?: string[];
  step6?: string[];
  step7?: string[];
  step7_backdrop?: string[];
  step7_banner?: string[];
  step8?: string[];
  step8_16x9?: string[];
  step8_1x1_thumbnail?: string[];
  step8_1x1_poster?: string[];
  step8_9x16?: string[];
  step8_4x3?: string[];
  step8_5x2?: string[];
  step9?: string[];
  step10?: string[];
  step11?: string[];
  step12?: string[];
  step13?: string[];
  step14?: string[];
  step15?: string[];
}

export type KnowledgeSection = keyof ProductionKnowledgeLinks;

export const KNOWLEDGE_SECTIONS: Record<KnowledgeSection, string> = {
  step1: 'Contract Signing',
  step2: 'Cities & Dates',
  step3: 'Venue Contracts',
  step4: 'Itinerary',
  step5: 'Material Collection',
  step5_videos: 'Past Performance Videos',
  step5_performerVideos: 'Performer Videos',
  step5_photos: 'Performance Scene Photos',
  step5_actorPhotos: 'Performer Photos',
  step5_otherPhotos: 'Other Photos',
  step5_logos: 'Logos',
  step5_texts: 'Texts',
  step6: 'Venue Info',
  step7: 'Designs',
  step7_backdrop: 'Backdrop',
  step7_banner: 'Rollup Banner',
  step8: 'Promotional Images',
  step8_16x9: 'Poster 16:9',
  step8_1x1_thumbnail: 'Thumbnail 1:1',
  step8_1x1_poster: 'Poster 1:1',
  step8_9x16: 'Poster 9:16',
  step8_4x3: 'Poster 4:3',
  step8_5x2: 'Cover 5:2',
  step9: 'Videos',
  step10: 'Press Conference',
  step11: 'Performance Shooting',
  step12: 'Social Media',
  step13: 'Advertising',
  step14: 'Sponsorship Packages',
  step15: 'Community Alliance',
};
