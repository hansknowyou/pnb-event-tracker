import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotionChannel extends Document {
  name: string;
  description: string;
  requirements: string;
  isPaidAds: boolean;
  languages: string[];
  notes: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const PromotionChannelSchema = new Schema<IPromotionChannel>(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    requirements: { type: String, trim: true, maxlength: 2000, default: '' },
    isPaidAds: { type: Boolean, default: false },
    languages: { type: [String], default: [] },
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
    link: { type: String, trim: true, maxlength: 500, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PromotionChannelSchema.index({ isDeleted: 1 });
PromotionChannelSchema.index({ name: 1 });

const PromotionChannel =
  mongoose.models.PromotionChannel ||
  mongoose.model<IPromotionChannel>('PromotionChannel', PromotionChannelSchema);

export default PromotionChannel;
