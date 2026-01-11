import mongoose from 'mongoose';

export interface IRoute {
  _id?: string;
  mediaId: string;
  routeName: string;
  redirectUrl: string;
  clickCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const RouteSchema = new mongoose.Schema<IRoute>(
  {
    mediaId: {
      type: String,
      required: true,
      index: true,
    },
    routeName: {
      type: String,
      required: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Route || mongoose.model<IRoute>('Route', RouteSchema);
