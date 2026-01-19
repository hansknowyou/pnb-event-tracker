import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityStaff {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface ICommunity extends Document {
  name: string;
  address: string;
  city: string;
  description: string;
  files: string;
  images: string;
  staff: ICommunityStaff[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const CommunityStaffSchema = new Schema<ICommunityStaff>({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
});

const CommunitySchema = new Schema<ICommunity>(
  {
    name: { type: String, required: true, maxlength: 200 },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    description: { type: String, default: '' },
    files: { type: String, default: '' },
    images: { type: String, default: '' },
    staff: { type: [CommunityStaffSchema], default: [] },
    createdBy: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes
CommunitySchema.index({ isDeleted: 1 });
CommunitySchema.index({ name: 1 });
CommunitySchema.index({ city: 1 });

const Community = mongoose.models.Community || mongoose.model<ICommunity>('Community', CommunitySchema);

export default Community;
