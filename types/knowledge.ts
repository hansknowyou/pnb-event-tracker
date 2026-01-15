export interface KnowledgeBaseItem {
  _id: string;
  title: string;
  description: string; // HTML from TipTap
  imageUrl?: string;
  imageKey?: string;
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
  step5_videos?: string[];
  step5_photos?: string[];
  step5_actorPhotos?: string[];
  step5_otherPhotos?: string[];
  step5_logos?: string[];
  step5_texts?: string[];
  step6?: string[];
  step7?: string[];
  step8?: string[];
  step9?: string[];
  step10?: string[];
  step11?: string[];
  step12?: string[];
  step13?: string[];
}

export type KnowledgeSection = keyof ProductionKnowledgeLinks;

export const KNOWLEDGE_SECTIONS: Record<KnowledgeSection, string> = {
  step1: 'Step 1: Contract Signing',
  step2: 'Step 2: Cities & Dates',
  step3: 'Step 3: Venue Contracts',
  step4: 'Step 4: Itinerary',
  step5_videos: 'Step 5.1: Videos',
  step5_photos: 'Step 5.2: Photos',
  step5_actorPhotos: 'Step 5.3: Actor Photos',
  step5_otherPhotos: 'Step 5.4: Other Photos',
  step5_logos: 'Step 5.5: Logos',
  step5_texts: 'Step 5.6: Texts',
  step6: 'Step 6: Venue Info',
  step7: 'Step 7: Designs',
  step8: 'Step 8: Promotional Images',
  step9: 'Step 9: Videos',
  step10: 'Step 10: Press Conference',
  step11: 'Step 11: Performance Shooting',
  step12: 'Step 12: Social Media',
  step13: 'Step 13: Advertising',
};
