import mongoose from 'mongoose';

export interface IOrganizationProfile {
  _id?: string;
  name: string;
  logo: string;
  updatedAt?: Date;
}

const OrganizationProfileSchema = new mongoose.Schema<IOrganizationProfile>(
  {
    name: { type: String, default: '' },
    logo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.OrganizationProfile ||
  mongoose.model<IOrganizationProfile>('OrganizationProfile', OrganizationProfileSchema);
