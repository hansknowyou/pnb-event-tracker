import mongoose from 'mongoose';

interface IMediaType {
  id: string;
  title: string;
  description: string;
  width: string;
  height: string;
  requirements: string;
  printRequired: boolean;
  languages: string[];
  notes: string;
  isVideo: boolean;
  videoLength: string;
  videoRatio: string;
}

export interface IMediaPackage {
  _id?: string;
  name: string;
  description: string;
  mediaTypes: IMediaType[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const MediaTypeSchema = new mongoose.Schema<IMediaType>(
  {
    id: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    width: { type: String, default: '' },
    height: { type: String, default: '' },
    requirements: { type: String, default: '' },
    printRequired: { type: Boolean, default: false },
    languages: { type: [String], default: [] },
    notes: { type: String, default: '' },
    isVideo: { type: Boolean, default: false },
    videoLength: { type: String, default: '' },
    videoRatio: { type: String, default: '' },
  },
  { _id: false }
);

const MediaPackageSchema = new mongoose.Schema<IMediaPackage>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    mediaTypes: { type: [MediaTypeSchema], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.MediaPackage ||
  mongoose.model<IMediaPackage>('MediaPackage', MediaPackageSchema);
