import mongoose from 'mongoose';

export interface IEvent {
  _id?: string;
  name: string;
  linkedProductionId?: string; // Link to Production
  createdAt?: Date;
  updatedAt?: Date;
}

const EventSchema = new mongoose.Schema<IEvent>(
  {
    name: {
      type: String,
      required: true,
    },
    linkedProductionId: {
      type: String,
      ref: 'Production',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
