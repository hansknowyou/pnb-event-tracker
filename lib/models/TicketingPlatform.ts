import mongoose, { Schema, Document } from 'mongoose';

export interface ITicketingPlatform extends Document {
  name: string;
  logo: string;
  link: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const TicketingPlatformSchema = new Schema<ITicketingPlatform>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    logo: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
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

TicketingPlatformSchema.index({ isDeleted: 1 });
TicketingPlatformSchema.index({ name: 1 });

const TicketingPlatform =
  mongoose.models.TicketingPlatform ||
  mongoose.model<ITicketingPlatform>('TicketingPlatform', TicketingPlatformSchema);

export default TicketingPlatform;
