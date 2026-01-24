export interface VenueStaff {
  name: string;
  role: string[];
  company: string;
  linkedCompanyId?: string;
  linkedCompanyStaffId?: string;
  email: string;
  phone: string;
  note: string;
}

export interface Venue {
  _id: string;
  name: string;
  location: string;
  city: string;
  intro: string;
  staff: VenueStaff[];
  logo?: string; // Base64-encoded logo
  image: string;
  otherImages: string[];
  files: string;
  mediaRequirements: string;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
