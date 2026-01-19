export interface CommunityStaff {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Community {
  _id: string;
  name: string;
  address: string;
  city: string;
  description: string;
  files: string; // Google Drive link
  images: string; // Google Drive link
  staff: CommunityStaff[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
