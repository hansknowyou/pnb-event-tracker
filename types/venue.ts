export interface VenueStaff {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Venue {
  _id: string;
  name: string;
  location: string;
  city: string;
  intro: string;
  staff: VenueStaff[];
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
