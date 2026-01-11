import mongoose from 'mongoose';

export interface IConfig {
  _id?: string;
  key: string;
  value: string;
  updatedAt?: Date;
}

const ConfigSchema = new mongoose.Schema<IConfig>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema);
