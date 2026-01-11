import mongoose from 'mongoose';

export interface IMedia {
  _id?: string;
  eventId: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MediaSchema = new mongoose.Schema<IMedia>(
  {
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
