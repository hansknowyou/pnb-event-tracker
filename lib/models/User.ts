import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  displayName: string;
  isAdmin: boolean;
  isActive: boolean;
  languagePreference: 'en' | 'zh';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    languagePreference: {
      type: String,
      enum: ['en', 'zh'],
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
