export interface CommunityStaff {
  name: string;
  role: string[];
  company?: string;
  linkedCompanyId?: string;
  linkedCompanyStaffId?: string;
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
  logo?: string; // Base64-encoded logo
  staff: CommunityStaff[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
