export interface PromotionChannel {
  _id?: string;
  name: string;
  description: string;
  requirements: string;
  isPaidAds: boolean;
  languages: string[];
  notes: string;
  link: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
