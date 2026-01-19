import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  cityName: string;
  province: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const CitySchema = new Schema<ICity>(
  {
    cityName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    province: {
      type: String,
      default: '',
      trim: true,
      maxlength: 100,
    },
    country: {
      type: String,
      default: '',
      trim: true,
      maxlength: 100,
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

CitySchema.index({ isDeleted: 1 });
CitySchema.index({ country: 1 });
CitySchema.index({ cityName: 1 });

const City =
  mongoose.models.City ||
  mongoose.model<ICity>('City', CitySchema);

export default City;
