export interface CompanyStaff {
  _id?: string;
  name: string;
  role: string[];
  email: string;
  phone: string;
}

export interface Company {
  _id: string;
  name: string;
  address: string;
  city: string;
  description: string;
  files: string; // Google Drive link
  images: string; // Google Drive link
  logo?: string; // Base64-encoded logo
  staff: CompanyStaff[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
