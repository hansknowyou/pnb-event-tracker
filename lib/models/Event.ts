import mongoose from 'mongoose';

export interface IEvent {
  _id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const EventSchema = new mongoose.Schema<IEvent>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
