import mongoose, { Schema, Document } from 'mongoose';

export interface IVenueStaff {
  name: string;
  role: string[];
  company: string;
  linkedCompanyId: string;
  linkedCompanyStaffId: string;
  email: string;
  phone: string;
  note: string;
}

export interface IVenue extends Document {
  name: string;
  location: string;
  city: string;
  intro: string;
  staff: IVenueStaff[];
  logo: string;
  image: string;
  otherImages: string;
  files: string;
  ticketingPlatformId: string;
  mediaRequirements: string;
  notes: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const VenueStaffSchema = new Schema<IVenueStaff>(
  {
    name: { type: String, default: '' },
    role: { type: [String], default: [] },
    company: { type: String, default: '' },
    linkedCompanyId: { type: String, default: '' },
    linkedCompanyStaffId: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    note: { type: String, default: '' },
  },
  { _id: false }
);

const VenueSchema = new Schema<IVenue>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    location: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    intro: {
      type: String,
      default: '',
      maxlength: 10000,
    },
    staff: {
      type: [VenueStaffSchema],
      default: [],
    },
    logo: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    otherImages: {
      type: String,
      default: '',
    },
    files: {
      type: String,
      default: '',
    },
    ticketingPlatformId: {
      type: String,
      default: '',
    },
    mediaRequirements: {
      type: String,
      default: '',
      maxlength: 10000,
    },
    notes: {
      type: String,
      default: '',
      maxlength: 10000,
    },
    createdBy: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

VenueSchema.index({ isDeleted: 1 });
VenueSchema.index({ city: 1 });
VenueSchema.index({ createdBy: 1 });

const existingVenue = mongoose.models.Venue;
if (existingVenue) {
  const staffPath = existingVenue.schema.path('staff') as {
    schema?: mongoose.Schema;
  } | undefined;
  const rolePath = staffPath?.schema?.path('role');
  const linkedCompanyPath = staffPath?.schema?.path('linkedCompanyId');
  const ticketingPlatformPath = existingVenue.schema.path('ticketingPlatformId');
  if (rolePath?.instance !== 'Array' || !linkedCompanyPath || !ticketingPlatformPath) {
    delete mongoose.models.Venue;
  }
}

const Venue =
  mongoose.models.Venue ||
  mongoose.model<IVenue>('Venue', VenueSchema);

export default Venue;
